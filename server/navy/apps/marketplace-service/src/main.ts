import { Config } from '@app/shared-library/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(Config.MARKETPLACE_SERVICE_PORT);
  Logger.log(`Marketplace-Service started at port: ${Config.MARKETPLACE_SERVICE_PORT}`);
}
bootstrap();
