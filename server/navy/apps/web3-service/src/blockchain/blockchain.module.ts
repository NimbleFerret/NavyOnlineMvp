import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BlockchainServiceCronos } from './blockchain.service.cronos';
import { BlockchainServiceVenom } from './blockchain.service.venom';
import { WorkersMarketplace } from '@app/shared-library/workers/workers.marketplace';
import { WorkersMint } from '@app/shared-library/workers/workers.mint';
import { Collection, CollectionSchema } from '@app/shared-library/schemas/marketplace/schema.collection';
import { Mint, MintSchema } from '@app/shared-library/schemas/marketplace/schema.mint';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
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
            name: WorkersMint.CronosMintQueue
        }),
        BullModule.registerQueue({
            name: WorkersMint.VenomMintQueue
        }),
        MongooseModule.forFeature([
            { name: Mint.name, schema: MintSchema },
            { name: Collection.name, schema: CollectionSchema },
        ]),
    ],
    providers: [
        BlockchainServiceCronos,
        BlockchainServiceVenom
    ],
    exports: [
        BlockchainServiceCronos,
        BlockchainServiceVenom
    ]
})
export class BlockchainModule { }
