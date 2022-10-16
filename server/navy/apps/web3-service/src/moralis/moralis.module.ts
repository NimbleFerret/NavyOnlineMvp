import { Captain, CaptainSchema } from '@app/shared-library/schemas/schema.captain';
import { Island, IslandSchema } from '@app/shared-library/schemas/schema.island';
import { Ship, ShipSchema } from '@app/shared-library/schemas/schema.ship';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoralisService } from './moralis.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Captain.name, schema: CaptainSchema }]),
    MongooseModule.forFeature([{ name: Ship.name, schema: ShipSchema }]),
    MongooseModule.forFeature([{ name: Island.name, schema: IslandSchema }]),
  ],
  providers: [MoralisService],
  exports: [MoralisService]
})
export class MoralisModule { }
