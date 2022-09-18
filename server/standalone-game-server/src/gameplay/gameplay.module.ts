/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GamemeplayController } from './gameplay.controller';
import { GameplayBattleService } from './battle/gameplay.battle.service';
import { GameplayIslandService } from './island/gameplay.island.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Ship, ShipSchema } from '../asset/asset.ship.entity';

@Module({
    imports: [MongooseModule.forFeature([{ name: Ship.name, schema: ShipSchema }])],
    controllers: [GamemeplayController],
    providers: [GameplayBattleService, GameplayIslandService],
    exports: [GameplayBattleService, GameplayIslandService]
})
export class GameplayModule { }