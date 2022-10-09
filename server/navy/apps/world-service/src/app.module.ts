import { WorldServiceGrpcClientOptions, WorldServiceGrpcPackage } from '@app/shared-library/gprc/grpc.world.service';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }