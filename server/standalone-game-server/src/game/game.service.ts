/* eslint-disable prettier/prettier */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AppEvents, NotifyPlayerEvent } from 'src/app.events';
import { DtoJoinGame } from 'src/ws/dto/dto.joinGame';

import { engine } from "../../GameEngine.js"
import { EntityShip } from './entity/entity.ship.js';
// import * as GameEngine from "../../GameEngine.js"

@Injectable()
export class GameService implements OnModuleInit {

    private gameEngine: engine.GameEngine;

    constructor(private eventEmitter: EventEmitter2) {
    }

    async onModuleInit() {
        this.gameEngine = new engine.GameEngine();

        console.log(this.gameEngine);

        this.gameEngine.tickCallback = () => {
            // console.log('Game engine tick callback');
        };

        // TODO implement init message for each new player
        this.gameEngine.createShipCallback = (ship: any) => {
            console.log('New ship added:');
            console.log(ship);

            console.log(this.gameEngine.shipManager.entities);

            const ships: EntityShip[] = [];

            for (const [key, value] of this.gameEngine.shipManager.entities) {
                ships.push(this.converJsShipToTypeScript(value));
            }

            console.log('Send all ships:');
            console.log(ships);

            this.eventEmitter.emit(AppEvents.NotifyEachPlayerEvent, {
                ships
            });
        };



        console.log(this.gameEngine);
    }

    private converJsShipToTypeScript(jsShip: any, full = true) {
        const result = {
            currentArmor: jsShip.currentArmor,
            currentHull: jsShip.currentHull,
            baseArmor: jsShip.baseArmor,
            baseHull: jsShip.baseHull,
            canMove: jsShip.canMove,
            maxSpeed: jsShip.maxSpeed,
            minSpeed: jsShip.minSpeed,
            speedStep: jsShip.speedStep,
            currentSpeed: jsShip.currentSpeed,
            dy: jsShip.dy,
            dx: jsShip.dx,
            y: jsShip.y,
            x: jsShip.x,
            rotation: jsShip.rotation,
            direction: jsShip.direction._hx_name,
            isCollides: jsShip.isCollides,
            isAlive: jsShip.isAlive,
            shapeWidth: jsShip.shapeWidth,
            shapeHeight: jsShip.shapeHeight,
            shapeWidthHalf: jsShip.shapeWidthHalf,
            shapeHeightHalf: jsShip.shapeHeightHalf,
            id: jsShip.id,
            ownerId: jsShip.ownerId
        } as EntityShip;

        return result;
    }

    // -------------------------------------
    // Player input events
    // -------------------------------------

    @OnEvent(AppEvents.PlayerJoinedEvent, { async: true })
    async handlePlayerJoinedEvent(data: DtoJoinGame) {
        console.log('Player ' + data.ethAddress + ' joined !');
        this.gameEngine.addShip(100, 100, data.ethAddress);
    }

}
