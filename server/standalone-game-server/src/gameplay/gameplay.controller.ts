/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from "@nestjs/common";
import { GameplayBattleService } from "./battle/gameplay.battle.service";
import { GameplayIslandService } from "./island/gameplay.island.service";

export class AddBotDto {
    instanceId: string;
    x: number;
    y: number;
}

@Controller('gameplay')
export class GamemeplayController {

    constructor(
        private readonly gameplayBattleService: GameplayBattleService,
        private readonly gameplayIslandService: GameplayIslandService) {
    }

    @Get('instancesInfo')
    getInfo() {
        // return this.gameService.getInstancesInfo();
    }

    @Post('addBot')
    addBot(@Body() dto: AddBotDto) {
        // return this.gameService.addBot(dto);
    }

}