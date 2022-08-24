/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
    AppEvents,
    NotifyAddShipEventMsg,
    NotifyEachPlayerEventMsg,
    NotifyPlayerEventMsg,
    NotifyShipMoveEventMsg,
    NotifyShipShootEventMsg,
    NotifyWorldStateEventMsg,
    PlayerDisconnectedEvent,
    PlayerMoveEventMsg,
    PlayerShootEventMsg
} from '../app.events';
import { DtoJoinGame } from '../ws/dto/dto.joinGame';
import { EntityShip } from './entity/entity.ship.js';
import { engine } from "../../GameEngine.js"
import { WsGateway } from 'src/ws/ws.gateway';

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

        // console.log(this.gameEngine);
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
        const ship = this.converJsShipToTypeScript(this.gameEngine.createShip((this.playerShipMap.size + 3) * 100, 100, undefined, data.ethAddress));
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

        }
    }

    @OnEvent(AppEvents.PlayerMove)
    async handlePlayerMove(data: PlayerMoveEventMsg) {
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
    async handlePlayerShoot(data: PlayerShootEventMsg) {
        const ship = this.playerShipMap.get(data.playerId);
        if (ship) {
            this.gameEngine.shipShootBySide(data.left ? 'Left' : 'Right', ship);

            const notifyShipShootEventMsg = {
                shipId: ship,
                leftSide: data.left
            } as NotifyShipShootEventMsg;

            const notifyEachPlayerEventMsg = {
                socketEvent: WsGateway.SocketServerMessageShipShoot,
                message: notifyShipShootEventMsg
            } as NotifyEachPlayerEventMsg;

            this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
        }
    }

}
