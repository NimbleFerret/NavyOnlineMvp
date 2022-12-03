import { Config } from '@app/shared-library/config';
import { GameplayBalancerServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.gameplay-balancer.service';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, GameplayBalancerServiceGrpcClientOptions);
  await app.listen();
  Logger.log(`Gameplay-Balancer-Service started at port: ${Config.GAMEPLAY_BALANCER_SERVICE_PORT}`);
}
bootstrap();
