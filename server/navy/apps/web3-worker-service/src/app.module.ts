import { Config } from '@app/shared-library/config';
import { EntityServiceGrpcClientName, EntityServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.entity.service';
import { BlockchainTransaction, BlockchainTransactionSchema } from '@app/shared-library/schemas/blockchain/schema.blockchain.transaction';
import { Collection, CollectionSchema } from '@app/shared-library/schemas/marketplace/schema.collection';
import { CollectionItem, CollectionItemSchema } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { Mint, MintSchema } from '@app/shared-library/schemas/marketplace/schema.mint';
import { WorkersMarketplace } from '@app/shared-library/workers/workers.marketplace';
import { WorkersMint } from '@app/shared-library/workers/workers.mint';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueMarketplaceUpdateProcessor } from './queue/queue.marketplace.update.processor';
import { QueueMarketplaceListingProcessor } from './queue/queue.marketplace.listing.processor';
import { QueueMintProcessor } from './queue/queue.mint.processor';
import { CaptainSettings, CaptainSettingsSchema } from '@app/shared-library/schemas/entity/schema.captain.settings';
import { CaptainTrait, CaptainTraitSchema } from '@app/shared-library/schemas/entity/schema.captain.trait';

@Module({
  imports: [
    BullModule.forRoot({
      redis: Config.GetRedisHost(),
    }),
    BullModule.registerQueue({
      name: WorkersMarketplace.MarketplaceUpdateQueue
    }),
    BullModule.registerQueue({
      name: WorkersMarketplace.MarketplaceListingQueue
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
      { name: CaptainTrait.name, schema: CaptainTraitSchema },
      { name: CaptainSettings.name, schema: CaptainSettingsSchema }
    ]),
    ClientsModule.register([
      {
        name: EntityServiceGrpcClientName,
        ...EntityServiceGrpcClientOptions(false),
      },
    ]),
  ],
  controllers: [
    AppController
  ],
  providers: [
    QueueMarketplaceUpdateProcessor,
    QueueMarketplaceListingProcessor,
    QueueMintProcessor,
    AppService
  ],
})
export class AppModule { }