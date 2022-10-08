import { NestFactory } from '@nestjs/core';
import { Web3ServiceModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(Web3ServiceModule);
  await app.listen(3000);
}
bootstrap();
