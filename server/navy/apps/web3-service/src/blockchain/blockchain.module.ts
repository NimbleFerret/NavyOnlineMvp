import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockchainQueueProcessor } from './blockchain.queue.processor';
import { BlockchainService } from './blockchain.service';
import { EthersProvider } from './blockchain.ethers.provider';
import { BlockchainTransaction, BlockchainTransactionSchema } from './schemas/schema.blockchain.transaction';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'blockchain',
        }),
        MongooseModule.forFeature([{ name: BlockchainTransaction.name, schema: BlockchainTransactionSchema }]),
    ],
    providers: [
        EthersProvider,
        BlockchainService,
        BlockchainQueueProcessor
    ],
    exports: [BlockchainService]
})
export class BlockchainModule { }
