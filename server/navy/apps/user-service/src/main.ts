import { UserServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.user.service';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, UserServiceGrpcClientOptions);
  await app.listen();
}
bootstrap();
