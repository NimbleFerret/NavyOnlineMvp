/* eslint-disable prettier/prettier */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';


@Injectable()
export class GameService implements OnModuleInit {

    async onModuleInit() {
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
