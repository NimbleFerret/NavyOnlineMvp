import {
    Injectable,
    Logger,
    OnModuleInit
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { VenomProvider } from '@app/shared-library/blockchain/venom/venom.provider';
import { WorkersMint } from '@app/shared-library/workers/workers.mint';
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

    private readonly venomProvider = new VenomProvider(
        this.nftMintedCallback,
        this.nftGeneratedCallback,
        this.nftListedCallback,
        this.nftDelistedCallback,
        this.nftSetPriceSetCallback,
        this.nftSoldCallback
    );
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

    // TODO add typed args
    private async nftMintedCallback() {

    }

    private async nftGeneratedCallback() {

    }

    private async nftListedCallback() {

    }

    private async nftDelistedCallback() {

    }

    private async nftSetPriceSetCallback() {

    }

    private async nftSoldCallback() {

    }

}