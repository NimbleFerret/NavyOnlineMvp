/* eslint-disable prettier/prettier */
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
    AppEvents,
    NotifyEachPlayerEventMsg,
    NotifyPlayerEventMsg,
    PlayerDisconnectedEvent
} from '../app.events';
import { EntityShip } from './entity/entity.ship.js';
import { engine } from "../../GameEngine.js"
import {
    SocketClientMessageJoinGame,
    SocketClientMessageMove,
    SocketServerMessageAddShip,
    SocketServerMessageGameInit,
    SocketServerMessageRemoveShip,
    SocketServerMessageShipMove,
    SocketServerMessageShipShoot,
    SocketServerMessageUpdateWorldState,
    WsProtocol
} from 'src/ws/ws.protocol';
import { Logger } from '@nestjs/common';

export class GameInstance {
    public readonly instanceId = uuidv4();

    private readonly playerShipMap: Map<string, string> = new Map();
    private readonly gameEngine: engine.GameEngine;

    constructor(private eventEmitter: EventEmitter2) {
        this.gameEngine = new engine.GameEngine();

        console.log(this.gameEngine);

        //

        this.gameEngine.tickCallback = () => {
            // Send only short info
        };

        this.gameEngine.createShipCallback = (ship: object) => {
            const socketServerMessageAddShip = {
                ship: this.converJsShipToTypeScript(ship)
            } as SocketServerMessageAddShip;

            const notifyEachPlayerEventMsg = {
                socketEvent: WsProtocol.SocketServerEventAddShip,
                message: socketServerMessageAddShip
            } as NotifyEachPlayerEventMsg;

            this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
        };

        this.gameEngine.deleteShipCallback = (ship: object) => {
            const jsShip = this.converJsShipToTypeScript(ship);
            console.log();
        };

        // TODO not shell but all shells from the ship 
        this.gameEngine.createShellCallback = (shells: any) => {
            const ship = this.gameEngine.getShipById(shells[0].ownerId);
            if (ship && ship.role == 'Bot') {
                const shotParams = shells.map(shell => {
                    return {
                        speed: shell.shellRnd.speed,
                        dir: shell.shellRnd.dir,
                        rotation: shell.shellRnd.rotation
                    }
                });

                const notifyShipShootEventMsg = {
                    playerId: ship.ownerId,
                    left: shells[0].side == 'Left' ? true : false,
                    shotParams
                } as SocketServerMessageShipShoot;

                const notifyEachPlayerEventMsg = {
                    socketEvent: WsProtocol.SocketServerEventShipShoot,
                    message: notifyShipShootEventMsg
                } as NotifyEachPlayerEventMsg;

                this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
            }
        };

        this.addBot(100, 100);
    }

    public addBot(x: number, y: number) {
        this.gameEngine.createShip('Bot', x, y);
    }

    public getPlayersCount() {
        return this.playerShipMap.size;
    }

    public getTotalShipsCount() {
        return this.gameEngine.shipManager.entities.size;
    }

    public destroy() {
        try {
            this.playerShipMap.clear();
            this.gameEngine.destroy();
        } catch (e) {
            Logger.error(e);
        }
    }

    // -------------------------------------
    // Player input events
    // -------------------------------------

    async handlePlayerJoinedEvent(data: SocketClientMessageJoinGame) {
        const ship = this.converJsShipToTypeScript(this.gameEngine.createShip('Player', 100, (this.playerShipMap.size) * 500, undefined, data.playerId));
        this.playerShipMap.set(ship.ownerId, ship.id);

        const socketServerMessageGameInit = {
            tickRate: this.gameEngine.gameLoop.targetFps,
            ships: this.collectShips(true)
        } as SocketServerMessageGameInit;

        const notifyPlayerEventMsg = {
            playerId: data.playerId,
            socketEvent: WsProtocol.SocketServerEventGameInit,
            message: socketServerMessageGameInit
        } as NotifyPlayerEventMsg;

        this.eventEmitter.emit(AppEvents.NotifyPlayer, notifyPlayerEventMsg);
    }

    async handlePlayerDisconnected(data: PlayerDisconnectedEvent) {
        const ship = this.playerShipMap.get(data.playerId);
        if (ship) {
            this.playerShipMap.delete(data.playerId);
            this.gameEngine.removeShip(ship);

            const socketServerMessageRemoveShip = {
                shipId: ship,
            } as SocketServerMessageRemoveShip;

            const notifyEachPlayerEventMsg = {
                socketEvent: WsProtocol.SocketServerEventRemoveShip,
                message: socketServerMessageRemoveShip
            } as NotifyEachPlayerEventMsg;

            this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
        }
    }

    async handlePlayerMove(data: SocketClientMessageMove) {
        const ship = this.playerShipMap.get(data.playerId);
        if (ship) {
            if (data.up)
                this.gameEngine.shipAccelerate(ship);
            if (data.down)
                this.gameEngine.shipDecelerate(ship);
            if (data.left)
                this.gameEngine.shipRotateLeft(ship);
            if (data.right)
                this.gameEngine.shipRotateRight(ship);

            const socketServerMessageShipMove = {
                shipId: ship,
                up: data.up,
                down: data.down,
                left: data.left,
                right: data.right
            } as SocketServerMessageShipMove;

            const notifyEachPlayerEventMsg = {
                socketEvent: WsProtocol.SocketServerEventShipMove,
                message: socketServerMessageShipMove
            } as NotifyEachPlayerEventMsg;

            this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
        }
    }

    async handlePlayerShoot(data: SocketServerMessageShipShoot) {
        const ship = this.playerShipMap.get(data.playerId);
        if (ship) {
            this.gameEngine.shipShootBySide(data.left ? 'Left' : 'Right', ship, data.shotParams);

            const socketServerMessageShipShoot = {
                playerId: data.playerId,
                left: data.left,
                shotParams: data.shotParams
            } as SocketServerMessageShipShoot;

            const notifyEachPlayerEventMsg = {
                socketEvent: WsProtocol.SocketServerEventShipShoot,
                message: socketServerMessageShipShoot
            } as NotifyEachPlayerEventMsg;

            this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
        }
    }

    //

    private collectShips(full: boolean) {
        const ships: EntityShip[] = [];
        for (const [key, value] of this.gameEngine.shipManager.entities) {
            ships.push(this.converJsShipToTypeScript(value, full));
        }
        // const result = {
        //     ships
        // } as SocketServerMessageUpdateWorldState;
        return ships;
    }

    private converJsShipToTypeScript(jsShip: any, full = true) {
        const result = {
            currentArmor: jsShip.currentArmor,
            currentHull: jsShip.currentHull,
            y: jsShip.y,
            x: jsShip.x,
            currentSpeed: jsShip.currentSpeed,
            direction: jsShip.direction._hx_name,
            id: jsShip.id
        } as EntityShip;

        if (full) {
            result.baseArmor = jsShip.baseArmor;
            result.baseHull = jsShip.baseHull;
            result.canMove = jsShip.canMove;
            result.maxSpeed = jsShip.maxSpeed;
            result.minSpeed = jsShip.minSpeed;
            result.speedStep = jsShip.speedStep;
            result.rotation = jsShip.rotation;
            result.isCollides = jsShip.isCollides;
            result.isAlive = jsShip.isAlive;
            result.shapeWidth = jsShip.shapeWidth;
            result.shapeHeight = jsShip.shapeHeight;
            result.shapeWidthHalf = jsShip.shapeWidthHalf;
            result.shapeHeightHalf = jsShip.shapeHeightHalf;
            result.ownerId = jsShip.ownerId;
        }

        return result;
    }
}