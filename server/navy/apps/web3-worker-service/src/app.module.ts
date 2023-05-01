import { Config } from '@app/shared-library/config';
import { BlockchainTransaction, BlockchainTransactionSchema } from '@app/shared-library/schemas/blockchain/schema.blockchain.transaction';
import { Collection, CollectionSchema } from '@app/shared-library/schemas/marketplace/schema.collection';
import { CollectionItem, CollectionItemSchema } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { Mint, MintSchema } from '@app/shared-library/schemas/marketplace/schema.mint';
import { WorkersMarketplace } from '@app/shared-library/workers/workers.marketplace';
import { WorkersMint } from '@app/shared-library/workers/workers.mint';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueMarketplaceProcessor } from './queue/queue.marketplace.processor';
import { QueueMintProcessor } from './queue/queue.mint.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: Config.GetRedisHost(),
    }),
    BullModule.registerQueue({
      name: WorkersMarketplace.UpdateMarketplaceQueue
    }),
    BullModule.registerQueue({
      name: WorkersMint.MintQueue
    }),
    MongooseModule.forRoot(Config.GetMongoHost(), {
      dbName: 'navy'
    }),
    MongooseModule.forFeature([
      { name: BlockchainTransaction.name, schema: BlockchainTransactionSchema },
      { name: Mint.name, schema: MintSchema },
      { name: Collection.name, schema: CollectionSchema },
      { name: CollectionItem.name, schema: CollectionItemSchema },
    ]),
  ],
  controllers: [
    AppController
  ],
  providers: [
    QueueMarketplaceProcessor,
    QueueMintProcessor,
    AppService
  ],
})
export class AppModule { }