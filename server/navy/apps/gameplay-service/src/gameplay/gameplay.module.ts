import { Ship, ShipSchema } from '@app/shared-library/schemas/entity/schema.ship';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameplayBattleService } from './battle/gameplay.battle.service';
import { GameplayIslandService } from './island/gameplay.island.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Ship.name, schema: ShipSchema }])],
    providers: [GameplayBattleService, GameplayIslandService],
    exports: [GameplayBattleService, GameplayIslandService]
})
export class GameplayModule { }