import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorldServiceGrpcClientName, WorldServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.world.service';
import { UserServiceGrpcClientName, UserServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: WorldServiceGrpcClientName,
        ...WorldServiceGrpcClientOptions,
      },
      {
        name: UserServiceGrpcClientName,
        ...UserServiceGrpcClientOptions,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
