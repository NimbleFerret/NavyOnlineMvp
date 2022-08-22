/* eslint-disable prettier/prettier */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AppEvents, NotifyPlayerEvent } from 'src/app.events';
import { DtoJoinGame } from 'src/ws/dto/dto.joinGame';

import { engine } from "../../GameEngine.js"
// import * as GameEngine from "../../GameEngine.js"

@Injectable()
export class GameService implements OnModuleInit {

    private gameEngine: engine.GameEngine;

    constructor(private eventEmitter: EventEmitter2) {
    }

    async onModuleInit() {
        this.gameEngine = new engine.GameEngine();

        this.gameEngine.createShipCallback = (ship: any) => {
            console.log('New ship added!!!');
            console.log(ship);
        };

        console.log(this.gameEngine);
    }

    // -------------------------------------
    // Player input events
    // -------------------------------------

    // @Interval(50)
    // handleInterval() {
    // Logger.log('50ms timer tick');
    // TODO notify players about game state 
    // }

    @OnEvent(AppEvents.PlayerJoinedEvent, { async: true })
    async handlePlayerJoinedEvent(data: DtoJoinGame) {
        // this.server.of()
        this.gameEngine.addShip(100, 100);
        console.log('handlePlayerJoinedEvent');
    }

}
