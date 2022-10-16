import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { WorldServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.world.service';
import { NFTService } from './nft.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'WorldServiceGrpcClient',
                ...WorldServiceGrpcClientOptions,
            },
        ]),
        BullModule.registerQueue({
            name: 'blockchain',
        }),
    ],
    providers: [NFTService],
    exports: [NFTService]
})
export class NFTModule { }
