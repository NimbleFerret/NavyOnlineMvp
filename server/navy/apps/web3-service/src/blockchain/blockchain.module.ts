import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { WorkersMarketplace } from '@app/shared-library/workers/workers.marketplace';
import { WorkersMint } from '@app/shared-library/workers/workers.mint';
import { Collection, CollectionSchema } from '@app/shared-library/schemas/marketplace/schema.collection';
import { Mint, MintSchema } from '@app/shared-library/schemas/marketplace/schema.mint';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        BullModule.registerQueue({
            name: WorkersMarketplace.UpdateMarketplaceQueue
        }),
        BullModule.registerQueue({
            name: WorkersMint.MintQueue
        }),
        MongooseModule.forFeature([
            { name: Mint.name, schema: MintSchema },
            { name: Collection.name, schema: CollectionSchema },
        ]),
    ],
    providers: [
        BlockchainService
    ],
    exports: [BlockchainService]
})
export class BlockchainModule { }
