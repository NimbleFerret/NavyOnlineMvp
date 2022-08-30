/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Sector, SectorSchema } from './sector.entity';
import { World, WorldSchema } from './world.entity';
import { WorldService } from './world.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sector.name, schema: SectorSchema }]),
    MongooseModule.forFeature([{ name: World.name, schema: WorldSchema }])
  ],
  controllers: [],
  providers: [WorldService],
  exports: [WorldService]
})
export class WorldModule { }
