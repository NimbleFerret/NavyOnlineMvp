/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shipyard, ShipyardSchema } from './shipyard.entity';
import { Ship, ShipSchema } from './shipyard.ship.entity';
import { ShipyardService } from './shipyard.service';
import { RandomModule } from 'src/random/random.module';

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
