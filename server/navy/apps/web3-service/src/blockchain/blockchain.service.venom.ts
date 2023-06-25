import {
    Injectable,
    Logger,
    OnModuleInit
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { VenomProvider } from '@app/shared-library/blockchain/venom/venom.provider';
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
    private static Context: BlockchainServiceVenom;

    constructor(
        configService: ConfigService,
        @InjectQueue(WorkersMarketplace.VenomMintQueue) mintQueue: Queue,
        @InjectQueue(WorkersMarketplace.VenomMarketplaceUpdateQueue) marketplaceUpdateQueue: Queue,
        @InjectQueue(WorkersMarketplace.VenomMarketplaceListingQueue) marketplaceListingQueue: Queue,
        @InjectQueue(WorkersMarketplace.VenomMarketplaceSoldQueue) marketplaceSoldQueue: Queue,
        @InjectQueue(WorkersMarketplace.VenomMarketplaceSetSalePriceQueue) marketplaceSetSalePriceQueue: Queue
    ) {
        BlockchainServiceVenom.Context = this;
        this.venomProvider = new VenomProvider(configService);

        this.blockchainBaseProcessor = new BlockchainBaseProcessor(
            SharedLibraryService.VENOM_CHAIN_NAME,
            mintQueue,
            marketplaceUpdateQueue,
            marketplaceListingQueue,
            marketplaceSoldQueue,
            marketplaceSetSalePriceQueue
        );

        console.log(this.blockchainBaseProcessor);
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

    private async nftMintedCallback(callbackData: any) {
        Logger.log('Captains mint occured:');
        Logger.log(callbackData);

        await BlockchainServiceVenom.Context.blockchainBaseProcessor.processNftMintedEvent(NftType.CAPTAIN, {
            nftId: callbackData.id,
            owner: callbackData.owner.toString()
        });
    }

    private async nftGeneratedCallback(nftId: any, owner: string, nftAddress: string) {
        Logger.log('Captains genererated occured:');
        Logger.log({ nftId, owner, nftAddress });

        // await BlockchainServiceVenom.Context.blockchainBaseProcessor.processNftGeneratedEvent(NftType.CAPTAIN, {
        //     nftId,
        //     owner,
        //     seller,
        //     price
        // });
    }

    private async nftListedCallback(nftId: any, seller: string) {
        Logger.log('Captains delisting occured:');
        Logger.log({ nftId, seller });

        await BlockchainServiceVenom.Context.blockchainBaseProcessor.processNftDelistedEvent(NftType.CAPTAIN, {
            nftId,
            seller
        });
    }

    private async nftDelistedCallback(nftId: any, seller: string) {
        Logger.log('Captains delisting occured:');
        Logger.log({ nftId: nftId, seller });

        await BlockchainServiceVenom.Context.blockchainBaseProcessor.processNftDelistedEvent(NftType.CAPTAIN, {
            nftId,
            seller
        });
    }

    private async nftSetPriceSetCallback(nftAddress: any, seller: string, price: any) {
        Logger.log('Captain price is set:');
        Logger.log({ nftAddress, seller, price });

        await BlockchainServiceVenom.Context.blockchainBaseProcessor.processNftSalePriceSetEvent(NftType.CAPTAIN, {
            nftAddress,
            seller,
            price
        });
    }

    private async nftSoldCallback(nftId: any, seller: string, owner: string, price: any) {
        Logger.log('Captain sold occured:');
        Logger.log({ nftId, seller, owner, price });

        await BlockchainServiceVenom.Context.blockchainBaseProcessor.processNftSoldEvent(NftType.CAPTAIN, {
            nftId,
            seller,
            owner,
            price
        });
    }

}