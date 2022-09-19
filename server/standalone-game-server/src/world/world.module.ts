/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameplayModule } from '../gameplay/gameplay.module';
import { World, WorldSchema } from './world.entity';
import { WorldService } from './world.service';
import { User, UserSchema } from '../user/user.entity';
import { Sector, SectorSchema } from './sector.entity';
import { AssetModule } from 'src/asset/asset.module';

@Module({
  imports: [
    AssetModule,
    GameplayModule,
    MongooseModule.forFeature([{ name: Sector.name, schema: SectorSchema }]),
    MongooseModule.forFeature([{ name: World.name, schema: WorldSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [WorldService],
  exports: [WorldService]
})
export class WorldModule { }
