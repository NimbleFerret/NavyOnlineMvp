import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { WorldServiceGrpcClientName, WorldServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.world.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: WorldServiceGrpcClientName,
        ...WorldServiceGrpcClientOptions,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
