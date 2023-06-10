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
    WorkersMarketplace,
} from '@app/shared-library/workers/workers.marketplace';
import { BlockchainBaseProcessor } from '@app/shared-library/blockchain/blockchain.base.provider';
import { SharedLibraryService } from '@app/shared-library';
import { ConfigService } from '@nestjs/config';
import { NftType } from '@app/shared-library/shared-library.main';
import { VenomConstants } from '@app/shared-library/blockchain/venom/venom.constants';

@Injectable()
export class BlockchainServiceVenom implements OnModuleInit {

    private readonly venomProvider: VenomProvider;
    private readonly blockchainBaseProcessor: BlockchainBaseProcessor;

    constructor(
        configService: ConfigService,
        @InjectQueue(WorkersMint.VenomMintQueue) mintQueue: Queue,
        @InjectQueue(WorkersMarketplace.VenomMarketplaceUpdateQueue) marketplaceUpdateQueue: Queue,
        @InjectQueue(WorkersMarketplace.VenomMarketplaceListingQueue) marketplaceListingQueue: Queue,
        @InjectQueue(WorkersMarketplace.VenomMarketplaceSoldQueue) marketplaceSoldQueue: Queue,
        @InjectQueue(WorkersMarketplace.VenomMarketplaceSetSalePriceQueue) marketplaceSetSalePriceQueue: Queue
    ) {
        this.venomProvider = new VenomProvider(configService);

        this.blockchainBaseProcessor = new BlockchainBaseProcessor(
            SharedLibraryService.VENOM_CHAIN_NAME,
            mintQueue,
            marketplaceUpdateQueue,
            marketplaceListingQueue,
            marketplaceSoldQueue,
            marketplaceSetSalePriceQueue
        );
    }

    async onModuleInit() {
        await this.venomProvider.init();
        await this.venomProvider.initCallbacks(
            this.nftMintedCallback,
            this.nftGeneratedCallback,
            this.nftListedCallback,
            this.nftDelistedCallback,
            this.nftSetPriceSetCallback,
            this.nftSoldCallback
        );
    }

    private async nftMintedCallback(id: any, owner: string) {
        Logger.log('Captains mint occured:');
        Logger.log({ id, owner });
        await this.blockchainBaseProcessor.processNftListedEvent(NftType.CAPTAIN, {
            nftId: id.toNumber(),
            owner: VenomConstants.CaptainsMarketplaceContractAddress,
            seller: owner
        });
    }

    private async nftGeneratedCallback(nftId: any, seller: string, owner: string, price: any) {
        Logger.log('Captains lising occured:');
        Logger.log({ nftId: nftId.toNumber(), seller, owner, price: price.toNumber() });
        await this.blockchainBaseProcessor.processNftListedEvent(NftType.CAPTAIN, {
            nftId,
            owner,
            seller,
            price
        });
    }

    private async nftListedCallback(nftId: any, seller: string) {
        Logger.log('Captains delisting occured:');
        Logger.log({ nftId: nftId.toNumber(), seller });

        await this.blockchainBaseProcessor.processNftDelistedEvent(NftType.CAPTAIN, {
            nftId,
            seller
        });
    }

    private async nftDelistedCallback(nftId: any, seller: string) {
        Logger.log('Captains delisting occured:');
        Logger.log({ nftId: nftId.toNumber(), seller });

        await this.blockchainBaseProcessor.processNftDelistedEvent(NftType.CAPTAIN, {
            nftId,
            seller
        });
    }

    private async nftSetPriceSetCallback(nftAddress: any, seller: string, price: any) {
        Logger.log('Captain price is set:');
        Logger.log({ nftAddress, seller, price: price.toNumber() });

        await this.blockchainBaseProcessor.processNftSalePriceSetEvent(NftType.CAPTAIN, {
            nftAddress,
            seller,
            price
        });
    }

    private async nftSoldCallback(nftId: any, seller: string, owner: string, price: any) {
        Logger.log('Captain sold occured:');
        Logger.log({ nftId: nftId.toNumber(), seller, owner, price: price.toNumber() });

        await this.blockchainBaseProcessor.processNftSoldEvent(NftType.CAPTAIN, {
            nftId,
            seller,
            owner,
            price
        });
    }

}