import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { NFTModule } from '../nft/nft.module';
import { WorkersMarketplace } from '@app/shared-library/workers/workers.marketplace';
import { WorkersMint } from '@app/shared-library/workers/workers.mint';

@Module({
    imports: [
        NFTModule,
        BullModule.registerQueue({
            name: WorkersMarketplace.UpdateMarketplaceQueue
        }),
        BullModule.registerQueue({
            name: WorkersMint.MintQueue
        }),
    ],
    providers: [
        BlockchainService
    ],
    exports: [BlockchainService]
})
export class BlockchainModule { }
