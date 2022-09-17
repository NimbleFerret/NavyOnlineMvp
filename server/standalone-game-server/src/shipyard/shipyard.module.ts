/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShipyardService } from './shipyard.service';
import { RandomModule } from '../random/random.module';
import { Shipyard, ShipyardSchema } from './shipyard.entity';
import { Ship, ShipSchema } from '../asset/asset.ship.entity';

@Module({
  imports: [
    RandomModule,
    MongooseModule.forFeature([{ name: Ship.name, schema: ShipSchema }]),
    MongooseModule.forFeature([{ name: Shipyard.name, schema: ShipyardSchema }]),
  ],
  providers: [ShipyardService],
  exports: [ShipyardService]
})
export class ShipyardModule { }
