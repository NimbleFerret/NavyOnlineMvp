import { Config } from '@app/shared-library/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(Config.WEB3_WORKER_SERVICE_PORT_HTTP);
  Logger.log(`Web3-Worker-Service started at port: ${Config.WEB3_WORKER_SERVICE_PORT_HTTP}`);
}
bootstrap();