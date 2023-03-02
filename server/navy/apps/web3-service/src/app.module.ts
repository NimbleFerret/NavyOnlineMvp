import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BlockchainModule } from './blockchain/blockchain.module';
import { MoralisModule } from './moralis/moralis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Config } from '@app/shared-library/config';

@Module({
  imports: [
    MoralisModule,
    BlockchainModule,
    BullModule.forRoot({
      redis: Config.GetRedisHost(),
    }),
    MongooseModule.forRoot(Config.GetMongoHost()),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
