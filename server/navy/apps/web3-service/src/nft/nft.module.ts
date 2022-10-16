import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { WorldServiceGrpcClientName, WorldServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.world.service';
import { Captain, CaptainSchema } from '@app/shared-library/schemas/schema.captain';
import { NFTService } from './nft.service';
import { Island, IslandSchema } from '@app/shared-library/schemas/schema.island';
import { Ship, ShipSchema } from '@app/shared-library/schemas/schema.ship';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: WorldServiceGrpcClientName,
                ...WorldServiceGrpcClientOptions,
            },
        ]),
        BullModule.registerQueue({
            name: 'blockchain',
        })
    ],
    providers: [NFTService],
    exports: [NFTService]
})
export class NFTModule { }
