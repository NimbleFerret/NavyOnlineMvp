/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GamemeplayController } from './gameplay.controller';
import { GameplayBattleService } from './battle/gameplay.battle.service';
import { GameplayIslandService } from './island/gameplay.island.service';

@Module({
    controllers: [GamemeplayController],
    providers: [GameplayBattleService, GameplayIslandService],
    exports: [GameplayBattleService, GameplayIslandService]
})
export class GameplayModule { }