import { Config } from '@app/shared-library/config';
import { GameplayBalancerServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.gameplay-balancer.service';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(GameplayBalancerServiceGrpcClientOptions);
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(Config.GAMEPLAY_BALANCER_SERVICE_PORT_HTTP);
  Logger.log(`Gameplay-Balancer-Service gRPC started at port: ${Config.GAMEPLAY_BALANCER_SERVICE_PORT} and HTTP at: ${Config.GAMEPLAY_BALANCER_SERVICE_PORT_HTTP}`);
}
bootstrap();
