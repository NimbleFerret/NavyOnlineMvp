import { Config } from '@app/shared-library/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Marketplace')
    .setDescription('Navy.online marketplace api')
    .setBasePath('marketplace')
    .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('marketplace', app, document);

  await app.listen(Config.MARKETPLACE_SERVICE_PORT);
  Logger.log(`Marketplace-Service started at port: ${Config.MARKETPLACE_SERVICE_PORT}`);
}
bootstrap();
