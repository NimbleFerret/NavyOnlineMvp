import { Config } from '@app/shared-library/config';
import { EntityServiceGrpcClientName, EntityServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.entity.service';
import { BlockchainTransaction, BlockchainTransactionSchema } from '@app/shared-library/schemas/blockchain/schema.blockchain.transaction';
import { Collection, CollectionSchema } from '@app/shared-library/schemas/marketplace/schema.collection';
import { CollectionItem, CollectionItemSchema } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { Mint, MintSchema } from '@app/shared-library/schemas/marketplace/schema.mint';
import { WorkersMarketplace } from '@app/shared-library/workers/workers.marketplace';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CaptainSettings, CaptainSettingsSchema } from '@app/shared-library/schemas/entity/schema.captain.settings';
import { CaptainTrait, CaptainTraitSchema } from '@app/shared-library/schemas/entity/schema.captain.trait';
import { ConfigModule } from '@nestjs/config';
import { QueueMintCronosProcessor } from './queue/processor/mint/queue.mint.cronos.processor';
import { QueueUpdateCronosProcessor } from './queue/processor/update/queue.updade.cronos.processor';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
      name: WorkersMarketplace.CronosMintQueue
    }),
    BullModule.registerQueue({
      name: WorkersMarketplace.CronosMarketplaceUpdateQueue
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
      name: WorkersMarketplace.VenomMintQueue
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
    AppService,
    QueueMintCronosProcessor,
    QueueUpdateCronosProcessor
    // QueueMintVenomProcessor
  ],
})
export class AppModule { }