import { Config } from '@app/shared-library/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { EmailModule } from './email/email.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(Config.GetMongoHost()),
    EmailModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
