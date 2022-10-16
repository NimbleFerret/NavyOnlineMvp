import { WorldServiceGrpcClientName, WorldServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.world.service';
import { Captain, CaptainSchema } from '@app/shared-library/schemas/schema.captain';
import { Island, IslandSchema } from '@app/shared-library/schemas/schema.island';
import { Ship, ShipSchema } from '@app/shared-library/schemas/schema.ship';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { MoralisService } from './moralis.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: WorldServiceGrpcClientName,
        ...WorldServiceGrpcClientOptions,
      },
    ]),
    MongooseModule.forFeature([{ name: Captain.name, schema: CaptainSchema }]),
    MongooseModule.forFeature([{ name: Ship.name, schema: ShipSchema }]),
    MongooseModule.forFeature([{ name: Island.name, schema: IslandSchema }]),
  ],
  providers: [MoralisService],
  exports: [MoralisService]
})
export class MoralisModule { }
