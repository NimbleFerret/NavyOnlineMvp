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
import {
  AuthServiceGrpcClientName,
  AuthServiceGrpcClientOptions
} from '@app/shared-library/gprc/grpc.auth.service';
import {
  Web3ServiceGrpcClientName,
  Web3ServiceGrpcClientOptions
} from '@app/shared-library/gprc/grpc.web3.service';
import { AuthMiddleware } from './auth.middleware';
import { MarketplaceModule } from './marketplace/marketplace.module';

@Module({
  imports: [
    MarketplaceModule,
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
      {
        name: AuthServiceGrpcClientName,
        ...AuthServiceGrpcClientOptions,
      },
      {
        name: Web3ServiceGrpcClientName,
        ...Web3ServiceGrpcClientOptions,
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
      .forRoutes({ path: 'auth/update', method: RequestMethod.POST });
  }
}
