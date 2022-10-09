import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { WorldServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.world.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, WorldServiceGrpcClientOptions);
  await app.listen();
}
bootstrap();
