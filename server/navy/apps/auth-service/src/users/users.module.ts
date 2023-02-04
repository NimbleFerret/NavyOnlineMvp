import { UserServiceGrpcClientName, UserServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.user.service';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: UserServiceGrpcClientName,
                ...UserServiceGrpcClientOptions,
            }
        ])
    ],
    providers: [
        UsersService,
    ],
    exports: [
        UsersService
    ]
})
export class UsersModule { }
