import { Config } from '@app/shared-library/config';
import { NotificationServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.notification.service';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, NotificationServiceGrpcClientOptions);
  await app.listen();
  Logger.log(`Notification-Service started at port: ${Config.NOTIFICATION_SERVICE_PORT}`);
}
bootstrap();
