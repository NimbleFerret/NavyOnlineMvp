import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { WorkersMarketplace } from '@app/shared-library/workers/workers.marketplace';
import { WorkersMint } from '@app/shared-library/workers/workers.mint';

@Module({
    imports: [
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
