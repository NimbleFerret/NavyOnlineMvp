/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameplayModule } from 'src/gameplay/gameplay.module';
import { User, UserSchema } from 'src/user/user.entity';
import { Island, IslandSchema } from './island.entity';
import { Sector, SectorSchema } from './sector.entity';
import { World, WorldSchema } from './world.entity';
import { WorldService } from './world.service';

@Module({
  imports: [
    GameplayModule,
    MongooseModule.forFeature([{ name: Sector.name, schema: SectorSchema }]),
    MongooseModule.forFeature([{ name: World.name, schema: WorldSchema }]),
    MongooseModule.forFeature([{ name: Island.name, schema: IslandSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [WorldService],
  exports: [WorldService]
})
export class WorldModule { }
