import { WorldServiceGrpcPackage, WorldServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.world.service';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { GrpcService } from './grpc.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'WorldServiceGrpcClient',
                ...WorldServiceGrpcClientOptions,
            },
        ]),
    ],
    providers: [GrpcService],
    exports: [GrpcService]
})
export class GrpcModule { }
