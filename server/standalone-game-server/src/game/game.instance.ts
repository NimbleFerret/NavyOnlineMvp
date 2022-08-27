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
    SocketClientMessageRespawn,
    SocketClientMessageShoot,
    SocketClientMessageSync,
    SocketServerMessageAddShip,
    SocketServerMessageGameInit,
    SocketServerMessageRemoveShip,
    SocketServerMessageShipMove,
    SocketServerMessageShipShoot,
    SocketServerMessageSync,
    SocketServerMessageUpdateWorldState,
    WsProtocol
} from 'src/ws/ws.protocol';
import { Logger } from '@nestjs/common';
import e from 'express';

export class GameInstance {

    public readonly worldStateUpdateIntervalMS = 5000;
    public readonly instanceId = uuidv4();

    private readonly playerShipMap: Map<string, string> = new Map();
    private readonly gameEngine: engine.GameEngine;
    private notifyGameWorldStateTimer: NodeJS.Timer;

    constructor(private eventEmitter: EventEmitter2) {
        this.gameEngine = new engine.GameEngine();
        this.notifyGameWorldStateTimer = setInterval(() => this.notifyGameWorldState(), this.worldStateUpdateIntervalMS);

        console.log(this.gameEngine);

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
            console.log('Ship destroyed');

            if (this.playerShipMap.has(jsShip.ownerId)) {
                this.playerShipMap.delete(jsShip.ownerId);
            }

            // TODO implement instance notification
            const socketServerMessageRemoveShip = {
                shipId: jsShip.id
            } as SocketServerMessageRemoveShip;

            const notifyEachPlayerEventMsg = {
                socketEvent: WsProtocol.SocketServerEventRemoveShip,
                message: socketServerMessageRemoveShip
            } as NotifyEachPlayerEventMsg;

            this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
        };

        // TODO Rename callback
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

                this.notifyAllPlayers(notifyShipShootEventMsg, WsProtocol.SocketServerEventShipShoot);
            }
        };

        this.addBot(100, -200);
    }

    private notifyGameWorldState() {
        if (this.playerShipMap.size > 0) {
            const socketServerMessageUpdateWorldState = {
                tick: this.gameEngine.tick,
                ships: this.collectShips(false)
            } as SocketServerMessageUpdateWorldState;

            this.notifyAllPlayers(socketServerMessageUpdateWorldState, WsProtocol.SocketServerEventUpdateWorldState);
        }
    }

    // -------------------------------------
    // General
    // -------------------------------------

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
            clearInterval(this.notifyGameWorldStateTimer);
            this.playerShipMap.clear();
            this.gameEngine.destroy();
        } catch (e) {
            Logger.error(e);
        }
    }

    private addPlayer(playerId: string) {
        const ship = this.converJsShipToTypeScript(this.gameEngine.createShip('Player', 100, (this.playerShipMap.size) * 500, undefined, playerId));
        this.playerShipMap.set(ship.ownerId, ship.id);
        return ship;
    }

    private notifyPlayer(playerId: string, message: object, event: string) {
        const notifyPlayerEventMsg = {
            playerId,
            socketEvent: event,
            message
        } as NotifyPlayerEventMsg;

        this.eventEmitter.emit(AppEvents.NotifyPlayer, notifyPlayerEventMsg);
    }

    private notifyAllPlayers(message: object, event: string) {
        const notifyEachPlayerEventMsg = {
            instanceId: this.instanceId,
            socketEvent: event,
            message
        } as NotifyEachPlayerEventMsg;

        this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
    }

    // -------------------------------------
    // Player input events
    // -------------------------------------

    async handlePlayerJoinedEvent(data: SocketClientMessageJoinGame) {
        this.addPlayer(data.playerId);

        const socketServerMessageGameInit = {
            instanceId: this.instanceId,
            tickRate: this.gameEngine.gameLoop.targetFps,
            worldStateSyncInterval: this.worldStateUpdateIntervalMS,
            ships: this.collectShips(true)
        } as SocketServerMessageGameInit;

        this.notifyPlayer(data.playerId, socketServerMessageGameInit, WsProtocol.SocketServerEventGameInit);
    }

    async handlePlayerDisconnected(data: PlayerDisconnectedEvent) {
        const ship = this.playerShipMap.get(data.playerId);
        if (ship) {
            this.playerShipMap.delete(data.playerId);
            this.gameEngine.removeShip(ship);

            const socketServerMessageRemoveShip = {
                shipId: ship,
            } as SocketServerMessageRemoveShip;

            this.notifyAllPlayers(socketServerMessageRemoveShip, WsProtocol.SocketServerEventRemoveShip);
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

            this.notifyAllPlayers(socketServerMessageShipMove, WsProtocol.SocketServerEventShipMove);
        }
    }

    async handlePlayerShoot(data: SocketClientMessageShoot) {
        const ship = this.playerShipMap.get(data.playerId);
        if (ship) {
            this.gameEngine.shipShootBySide(data.left ? 'Left' : 'Right', ship, data.shotParams);

            const socketServerMessageShipShoot = {
                playerId: data.playerId,
                left: data.left,
                shotParams: data.shotParams
            } as SocketServerMessageShipShoot;

            this.notifyAllPlayers(socketServerMessageShipShoot, WsProtocol.SocketServerEventShipShoot);
        }
    }

    async handlePlayerSync(data: SocketClientMessageSync) {
        const ship = this.playerShipMap.get(data.playerId);
        if (ship) {
            const socketServerMessageSync = {
                ships: this.collectShips(true)
            } as SocketServerMessageSync;
            this.notifyPlayer(data.playerId, socketServerMessageSync, WsProtocol.SocketServerEventSync);
        }
    }

    async handlePlayerRespawn(data: SocketClientMessageRespawn) {
        if (!this.playerShipMap.has(data.playerId)) {
            const ship = this.addPlayer(data.playerId);
            const socketServerMessageAddShip = {
                ship
            } as SocketServerMessageAddShip;
            this.notifyAllPlayers(socketServerMessageAddShip, WsProtocol.SocketServerEventAddShip);
        } else {
            Logger.error(`Cant respawn player ${data.playerId} while playing`);
        }
    }

    // -------------------------------------
    // Data preparatio
    // -------------------------------------

    private collectShips(full: boolean) {
        const ships: EntityShip[] = [];
        for (const [key, value] of this.gameEngine.shipManager.entities) {
            ships.push(this.converJsShipToTypeScript(value, full));
        }
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