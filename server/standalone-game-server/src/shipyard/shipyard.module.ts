/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shipyard, ShipyardSchema } from './shipyard.entity';
import { ShipyardService } from './shipyard.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shipyard.name, schema: ShipyardSchema }]),
  ],
  providers: [ShipyardService],
  exports: [ShipyardService]
})
export class ShipyardModule { }
