import {
    Injectable,
    Logger,
    OnModuleInit
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Constants } from '../app.constants';
import { NftType } from '@app/shared-library/shared-library.main';
import { ethers } from 'ethers';
import {
    CheckEthersAuthSignatureRequest,
    CheckEthersAuthSignatureResponse,
} from '@app/shared-library/gprc/grpc.web3.service';
import { VenomProvider } from '@app/shared-library/blockchain/venom/venom.provider';
import { MintJob, WorkersMint } from '@app/shared-library/workers/workers.mint';
import {
    MarketplaceUpdateJob,
    MarketplaceListingJob,
    WorkersMarketplace,
} from '@app/shared-library/workers/workers.marketplace';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MarketplaceState } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { BlockchainEventsProcessor } from '@app/shared-library/blockchain/blockchain.base.provider';
import { SharedLibraryService } from '@app/shared-library';

@Injectable()
export class BlockchainServiceVenom implements OnModuleInit {

    private readonly venomProvider = new VenomProvider();
    private readonly blockchainEventsProcessor: BlockchainEventsProcessor;

    constructor(
        @InjectQueue(WorkersMint.VenomMintQueue) mintQueue: Queue,
        @InjectQueue(WorkersMarketplace.VenomMarketplaceUpdateQueue) marketplaceUpdateQueue: Queue,
        @InjectQueue(WorkersMarketplace.VenomMarketplaceListingQueue) marketplaceListingQueue: Queue,
        @InjectQueue(WorkersMarketplace.VenomMarketplaceSoldQueue) marketplaceSoldQueue: Queue,
        @InjectQueue(WorkersMarketplace.VenomMarketplaceSetSalePriceQueue) marketplaceSetSalePriceQueue: Queue
    ) {
        this.blockchainEventsProcessor = new BlockchainEventsProcessor(
            SharedLibraryService.VENOM_CHAIN_NAME,
            mintQueue,
            marketplaceUpdateQueue,
            marketplaceListingQueue,
            marketplaceSoldQueue,
            marketplaceSetSalePriceQueue
        );
    }

    async onModuleInit() {
        // TODO pass config here
        await this.venomProvider.init('', '');


    }

}