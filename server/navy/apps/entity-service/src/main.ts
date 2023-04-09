import { Config } from '@app/shared-library/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Config.ENTITY_SERVICE_PORT);
  Logger.log(`Entity-Service started at port: ${Config.ENTITY_SERVICE_PORT}`);
}
bootstrap();
