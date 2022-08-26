/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Post } from '@nestjs/common';
import { GameService } from './game.service';

export class AddBotDto {
    x: number;
    y: number;
}

@Controller('game')
export class GameController {

    constructor(private readonly gameService: GameService) {

    }

    @Get('info')
    getInfo() {
        return 'Every thing is ok';
    }

    @Post('addBot')
    addBot(@Body() addBotDto: AddBotDto) {
        console.log(addBotDto);
    }

}