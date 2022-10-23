import { GameplayBalancerServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.gameplay-balancer.service';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, GameplayBalancerServiceGrpcClientOptions);
  await app.listen();
}
bootstrap();
