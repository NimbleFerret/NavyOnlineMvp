import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  WorldServiceGrpcClientName,
  WorldServiceGrpcClientOptions
} from '@app/shared-library/gprc/grpc.world.service';
import {
  UserServiceGrpcClientName,
  UserServiceGrpcClientOptions
} from '@app/shared-library/gprc/grpc.user.service';
import {
  GameplayBalancerServiceGrpcClientName,
  GameplayBalancerServiceGrpcClientOptions
} from '@app/shared-library/gprc/grpc.gameplay-balancer.service';
import { AuthMiddleware } from './auth.middleware';

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
      {
        name: GameplayBalancerServiceGrpcClientName,
        ...GameplayBalancerServiceGrpcClientOptions,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'auth/check', method: RequestMethod.GET });
  }
}
