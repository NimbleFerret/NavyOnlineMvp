// /* eslint-disable prettier/prettier */

// import { Body, Controller, Get, Post } from '@nestjs/common';
// import { GameService } from './game.service';

// export class AddBotDto {
//     instanceId: string;
//     x: number;
//     y: number;
// }

// @Controller('game')
// export class GameController {

//     constructor(private readonly gameService: GameService) {
//     }

//     @Get('instancesInfo')
//     getInfo() {
//         return this.gameService.getInstancesInfo();
//     }

//     @Post('addBot')
//     addBot(@Body() dto: AddBotDto) {
//         return this.gameService.addBot(dto);
//     }

// }