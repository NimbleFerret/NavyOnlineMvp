import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BlockchainModule } from './blockchain/blockchain.module';
import { MoralisModule } from './moralis/moralis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NFTModule } from './nft/nft.module';

@Module({
  imports: [
    MoralisModule,
    BlockchainModule,
    NFTModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 49154,
        password: '123456'
      },
    }),
    MongooseModule.forRoot('mongodb://localhost/navy')
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
