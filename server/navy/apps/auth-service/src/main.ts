import { Config } from '@app/shared-library/config';
import { AuthServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.auth.service';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, AuthServiceGrpcClientOptions);
  await app.listen();
  Logger.log(`Auth-Service started at port: ${Config.AUTH_SERVICE_PORT}`);

}
bootstrap();