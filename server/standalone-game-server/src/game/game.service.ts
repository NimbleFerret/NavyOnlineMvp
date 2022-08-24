/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AppEvents, NotifyPlayerEventMsg, NotifyWorldStateEventMsg, PlayerDisconnectedEvent } from '../app.events';
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
            // console.log('Game engine tick callback');

            // TODO send ships data
            // Send only short info
        };

        // TODO implement init message for each new player
        this.gameEngine.createShipCallback = (ship: object) => {
            console.log('New ship added:');
            console.log(ship);

            console.log(this.gameEngine.shipManager.entities);

            //     console.log('Send all ships:');
            //     console.log(ships);

            //     this.eventEmitter.emit(AppEvents.NotifyEachPlayerEvent, {
            //         ships
            //     });
        };

        console.log(this.gameEngine);
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

    @OnEvent(AppEvents.PlayerJoined, { async: true })
    async handlePlayerJoinedEvent(data: DtoJoinGame) {
        const ship = this.converJsShipToTypeScript(this.gameEngine.createShip(100, 100, data.ethAddress));
        this.playerShipMap.set(ship.ownerId, ship.id);

        const notifyGameInit = {
            playerId: data.ethAddress,
            socketEvent: WsGateway.SocketServerGameInit,
            message: this.collectGameState(true)
        } as NotifyPlayerEventMsg;
        this.eventEmitter.emit(AppEvents.NotifyPlayer, notifyGameInit);
    }

    @OnEvent(AppEvents.PlayerDisconnected, { async: true })
    async handlePlayerDisconnected(data: PlayerDisconnectedEvent) {
        const ship = this.playerShipMap.get(data.playerId);
        if (ship) {

        }
    }

}
