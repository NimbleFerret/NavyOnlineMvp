import { Config } from '@app/shared-library/config';
import {
  GameplayBalancerServiceGrpcClientName,
  GameplayBalancerServiceGrpcClientOptions
} from '@app/shared-library/gprc/grpc.gameplay-balancer.service';
import {
  UserServiceGrpcClientName,
  UserServiceGrpcClientOptions
} from '@app/shared-library/gprc/grpc.user.service';
import {
  WorldServiceGrpcClientName,
  WorldServiceGrpcClientOptions
} from '@app/shared-library/gprc/grpc.world.service';
import { MetricsModule } from '@app/shared-library/metrics/metrics.module';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameplayModule } from './gameplay/gameplay.module';
import { WsModule } from './ws/ws.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: WorldServiceGrpcClientName,
        ...WorldServiceGrpcClientOptions,
      },
      {
        name: UserServiceGrpcClientName,
        ...UserServiceGrpcClientOptions,
      },
      {
        name: GameplayBalancerServiceGrpcClientName,
        ...GameplayBalancerServiceGrpcClientOptions,
      },
    ]),
    MongooseModule.forRoot(Config.GetMongoHost(), {
      dbName: Config.MongoDBName
    }),
    GameplayModule,
    WsModule,
    MetricsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
