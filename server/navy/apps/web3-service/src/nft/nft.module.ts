import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { WorldServiceGrpcClientName, WorldServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.world.service';
import { NFTService } from './nft.service';
import { Mint, MintSchema } from '@app/shared-library/schemas/marketplace/schema.mint';
import { Collection, CollectionSchema } from '@app/shared-library/schemas/marketplace/schema.collection';
import { Project, ProjectSchema } from '@app/shared-library/schemas/marketplace/schema.project';

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
        }),
        MongooseModule.forFeature([
            { name: Collection.name, schema: CollectionSchema },
            { name: Mint.name, schema: MintSchema },
        ]),
    ],
    providers: [NFTService],
    exports: [NFTService]
})
export class NFTModule { }
