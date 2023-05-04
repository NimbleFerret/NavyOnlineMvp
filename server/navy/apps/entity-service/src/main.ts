import { Config } from '@app/shared-library/config';
import { EntityServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.entity.service';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, EntityServiceGrpcClientOptions);
  await app.listen();

  Logger.log(`Entity-Service started at port: ${Config.ENTITY_SERVICE_PORT}`);
}
bootstrap();