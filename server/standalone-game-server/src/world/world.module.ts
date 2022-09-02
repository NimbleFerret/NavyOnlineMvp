/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameModule } from 'src/game/game.module';
import { Island, IslandSchema } from './island.entity';
import { Sector, SectorSchema } from './sector.entity';
import { World, WorldSchema } from './world.entity';
import { WorldService } from './world.service';

@Module({
  imports: [
    GameModule,
    MongooseModule.forFeature([{ name: Sector.name, schema: SectorSchema }]),
    MongooseModule.forFeature([{ name: World.name, schema: WorldSchema }]),
    MongooseModule.forFeature([{ name: Island.name, schema: IslandSchema }]),
  ],
  providers: [WorldService],
  exports: [WorldService]
})
export class WorldModule { }
