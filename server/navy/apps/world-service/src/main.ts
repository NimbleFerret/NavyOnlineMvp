import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { WorldServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.world.service';
import { Config } from '@app/shared-library/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, WorldServiceGrpcClientOptions);
  await app.listen();
  Logger.log(`World-Service started at port: ${Config.WORLD_SERVICE_PORT}`);
}
bootstrap();
