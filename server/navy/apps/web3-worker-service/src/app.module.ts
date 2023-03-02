import { Config } from '@app/shared-library/config';
import { BlockchainTransaction, BlockchainTransactionSchema } from '@app/shared-library/schemas/blockchain/schema.blockchain.transaction';
import { CollectionItem, CollectionItemSchema } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { WorkersMarketplace } from '@app/shared-library/workers/workers.marketplace';
import { WorkersMint } from '@app/shared-library/workers/workers.mint';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { QueueMarketplaceProcessor } from './queue/queue.marketplace.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 49154
      },
    }),
    BullModule.registerQueue({
      name: WorkersMarketplace.UpdateMarketplaceQueue
    }),
    BullModule.registerQueue({
      name: WorkersMint.MintQueue
    }),
    MongooseModule.forRoot(Config.GetMongoHost()),
    MongooseModule.forFeature([
      { name: BlockchainTransaction.name, schema: BlockchainTransactionSchema },
      { name: CollectionItem.name, schema: CollectionItemSchema },
    ]),
  ],
  controllers: [],
  providers: [
    AppService,
    QueueMarketplaceProcessor
  ],
})
export class AppModule { }