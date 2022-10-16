import { Config } from '@app/shared-library/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Config.GATEWAY_SERVICE_PORT);
}
bootstrap();
