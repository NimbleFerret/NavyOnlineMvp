import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const argsPort = process.env.npm_config_port;
  const argsRegion = process.env.npm_config_region;
  if (argsPort) {
    AppService.SERVICE_PORT = Number(argsPort);
  }
  if (argsRegion) {
    AppService.SERVICE_REGION = String(argsRegion);
  }
  const app = await NestFactory.create(AppModule);
  await app.listen(AppService.SERVICE_PORT);
  app.enableCors();
  Logger.log(`Gameplay service started at port: ${AppService.SERVICE_PORT} and region: ${AppService.SERVICE_REGION}`);
}
bootstrap();
