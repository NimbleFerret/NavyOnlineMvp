/* eslint-disable prettier/prettier */
import { Ship, ShipSchema } from '@app/shared-library/schemas/schema.ship';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forFeature([{ name: Ship.name, schema: ShipSchema }])],
    // providers: [GameplayBattleService, GameplayIslandService],
    // exports: [GameplayBattleService, GameplayIslandService]
})
export class GameplayModule { }