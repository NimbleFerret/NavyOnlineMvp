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
// import { QueueMarketplaceUpdateProcessor } from './queue/queue.marketplace.update.processor';
// import { QueueMarketplaceListingProcessor } from './queue/queue.marketplace.listing.processor';
// import { QueueMintProcessor } from './queue/queue.mint.processor';
import { CaptainSettings, CaptainSettingsSchema } from '@app/shared-library/schemas/entity/schema.captain.settings';
import { CaptainTrait, CaptainTraitSchema } from '@app/shared-library/schemas/entity/schema.captain.trait';
import { QueueMintCronosProcessor } from './queue/queue.mint.cronos.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: Config.GetRedisHost(),
    }),
    BullModule.registerQueue({
      name: WorkersMarketplace.CronosMarketplaceUpdateQueue
    }),
    BullModule.registerQueue({
      name: WorkersMarketplace.CronosMarketplaceListingQueue
    }),
    BullModule.registerQueue({
      name: WorkersMarketplace.CronosMarketplaceSoldQueue
    }),
    BullModule.registerQueue({
      name: WorkersMint.CronosMintQueue
    }),
    BullModule.registerQueue({
      name: WorkersMarketplace.VenomMarketplaceUpdateQueue
    }),
    BullModule.registerQueue({
      name: WorkersMarketplace.VenomMarketplaceListingQueue
    }),
    BullModule.registerQueue({
      name: WorkersMarketplace.VenomMarketplaceSoldQueue
    }),
    BullModule.registerQueue({
      name: WorkersMarketplace.VenomMarketplaceSetSalePriceQueue
    }),
    BullModule.registerQueue({
      name: WorkersMint.VenomMintQueue
    }),
    MongooseModule.forRoot(Config.GetMongoHost(), {
      dbName: Config.MongoDBName
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
    // QueueMarketplaceUpdateProcessor,
    // QueueMarketplaceListingProcessor,
    // QueueMintProcessor,
    // QueueMintProcessor,
    AppService,
    QueueMintCronosProcessor
  ],
})
export class AppModule { }