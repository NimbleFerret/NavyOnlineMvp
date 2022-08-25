/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
    AppEvents,
    NotifyAddShipEventMsg,
    NotifyEachPlayerEventMsg,
    NotifyPlayerEventMsg,
    NotifyRemoveShipEventMsg,
    NotifyShipMoveEventMsg,
    NotifyShipShootEventMsg,
    NotifyWorldStateEventMsg,
    PlayerDisconnectedEvent
} from '../app.events';
import { DtoJoinGame } from '../ws/dto/dto.joinGame';
import { EntityShip } from './entity/entity.ship.js';
import { engine } from "../../GameEngine.js"
import { WsGateway } from 'src/ws/ws.gateway';
import { DtoShoot } from 'src/ws/dto/dto.shoot';
import { DtoMove } from 'src/ws/dto/dto.move';

@Injectable()
export class GameService implements OnModuleInit {

    private readonly playerShipMap: Map<string, string> = new Map();

    private gameEngine: engine.GameEngine;

    constructor(private eventEmitter: EventEmitter2) {
    }

    async onModuleInit() {
        this.gameEngine = new engine.GameEngine();

        console.log(this.gameEngine);

        this.gameEngine.tickCallback = () => {
            // Send only short info
        };

        this.gameEngine.createShipCallback = (ship: object) => {
            const notifyAddShipEventMsg = {
                ship: this.converJsShipToTypeScript(ship)
            } as NotifyAddShipEventMsg;

            const notifyEachPlayerEventMsg = {
                socketEvent: WsGateway.SocketServerMessageAddShip,
                message: notifyAddShipEventMsg
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
                } as NotifyShipShootEventMsg;

                const notifyEachPlayerEventMsg = {
                    socketEvent: WsGateway.SocketServerMessageShipShoot,
                    message: notifyShipShootEventMsg
                } as NotifyEachPlayerEventMsg;

                this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
            }
        };

        // Bots

        this.gameEngine.createShip('Bot', 500, 500);
        // this.gameEngine.createShip('Bot', 800, 500)
    }

    private collectGameState(full: boolean) {
        const ships: EntityShip[] = [];
        for (const [key, value] of this.gameEngine.shipManager.entities) {
            ships.push(this.converJsShipToTypeScript(value, full));
        }
        const result = {
            ships
        } as NotifyWorldStateEventMsg;
        return result;
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

    // -------------------------------------
    // Player input events
    // -------------------------------------

    @OnEvent(AppEvents.PlayerJoined)
    async handlePlayerJoinedEvent(data: DtoJoinGame) {
        const ship = this.converJsShipToTypeScript(this.gameEngine.createShip('Player', 100, (this.playerShipMap.size) * 500, undefined, data.ethAddress));
        this.playerShipMap.set(ship.ownerId, ship.id);

        const notifyPlayerEventMsg = {
            playerId: data.ethAddress,
            socketEvent: WsGateway.SocketServerGameInit,
            message: this.collectGameState(true)
        } as NotifyPlayerEventMsg;
        this.eventEmitter.emit(AppEvents.NotifyPlayer, notifyPlayerEventMsg);
    }

    @OnEvent(AppEvents.PlayerDisconnected)
    async handlePlayerDisconnected(data: PlayerDisconnectedEvent) {
        const ship = this.playerShipMap.get(data.playerId);
        if (ship) {
            this.gameEngine.removeShip(ship);

            const notifyRemoveShipEventMsg = {
                shipId: ship,
            } as NotifyRemoveShipEventMsg;

            const notifyEachPlayerEventMsg = {
                socketEvent: WsGateway.SocketServerMessageRemoveShip,
                message: notifyRemoveShipEventMsg
            } as NotifyEachPlayerEventMsg;

            this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
        }
    }

    @OnEvent(AppEvents.PlayerMove)
    async handlePlayerMove(data: DtoMove) {
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

            const notifyShipMoveEventMsg = {
                shipId: ship,
                up: data.up,
                down: data.down,
                left: data.left,
                right: data.right
            } as NotifyShipMoveEventMsg;

            const notifyEachPlayerEventMsg = {
                socketEvent: WsGateway.SocketServerMessageShipMove,
                message: notifyShipMoveEventMsg
            } as NotifyEachPlayerEventMsg;

            this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
        }
    }

    @OnEvent(AppEvents.PlayerShoot)
    async handlePlayerShoot(data: DtoShoot) {
        const ship = this.playerShipMap.get(data.playerId);
        if (ship) {
            this.gameEngine.shipShootBySide(data.left ? 'Left' : 'Right', ship, data.shotParams);

            const notifyShipShootEventMsg = {
                playerId: data.playerId,
                left: data.left,
                shotParams: data.shotParams
            } as NotifyShipShootEventMsg;

            const notifyEachPlayerEventMsg = {
                socketEvent: WsGateway.SocketServerMessageShipShoot,
                message: notifyShipShootEventMsg
            } as NotifyEachPlayerEventMsg;

            this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
        }
    }

}
