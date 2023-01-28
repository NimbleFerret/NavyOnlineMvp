import { Config } from '@app/shared-library/config';
import { UserServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.user.service';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, UserServiceGrpcClientOptions);
  await app.listen();
  Logger.log(`User-Service started at port: ${Config.USER_SERVICE_PORT}`);
}
bootstrap();
