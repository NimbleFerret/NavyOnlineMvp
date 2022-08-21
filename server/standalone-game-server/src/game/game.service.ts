/* eslint-disable prettier/prettier */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

// import * as x from './tools';

import * as GameEngine from '../../GameEngine.js';

// const GameEngine = require('tools.js');

@Injectable()
export class GameService implements OnModuleInit {

    async onModuleInit() {
        // TODO start game instance
        console.log(GameEngine);
    }

    // -------------------------------------
    // Player input events
    // -------------------------------------

    @Interval(50)
    handleInterval() {
        // Logger.log('50ms timer tick');
        // TODO notify players about game state 
    }

}
