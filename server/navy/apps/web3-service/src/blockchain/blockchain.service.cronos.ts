import * as Captain from '../abi/Captain.json';
import * as Aks from '../abi/Aks.json';
import * as Nvy from '../abi/Nvy.json';
import * as Ship from '../abi/Ship.json';
import * as Island from '../abi/Island.json';
import * as CollectionSale from '../abi/CollectionSale.json';
import * as Marketplace from '../abi/Marketplace.json';
import {
    Injectable,
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
import { CronosProvider } from '@app/shared-library/blockchain/cronos/cronos.provider';
import { WorkersMint } from '@app/shared-library/workers/workers.mint';
import { WorkersMarketplace } from '@app/shared-library/workers/workers.marketplace';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MarketplaceState } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { BlockchainEventsProcessor } from '@app/shared-library/blockchain/blockchain.base.provider';
import { SharedLibraryService } from '@app/shared-library';
import { CronosConstants } from '@app/shared-library/blockchain/cronos/cronos.constants';

@Injectable()
export class BlockchainServiceCronos implements OnModuleInit {

    private readonly cronosProvider = new CronosProvider();
    private readonly blockchainEventsProcessor: BlockchainEventsProcessor;

    constructor(
        @InjectQueue(WorkersMint.CronosMintQueue) mintQueue: Queue,
        @InjectQueue(WorkersMarketplace.CronosMarketplaceUpdateQueue) marketplaceUpdateQueue: Queue,
        @InjectQueue(WorkersMarketplace.CronosMarketplaceListingQueue) marketplaceListingQueue: Queue,
        @InjectQueue(WorkersMarketplace.CronosMarketplaceSoldQueue) marketplaceSoldQueue: Queue
    ) {
        this.blockchainEventsProcessor = new BlockchainEventsProcessor(
            SharedLibraryService.CRONOS_CHAIN_NAME,
            mintQueue,
            marketplaceUpdateQueue,
            marketplaceListingQueue,
            marketplaceSoldQueue
        );
    }

    async onModuleInit() {
        await this.cronosProvider.init({
            Captain,
            Aks,
            Nvy,
            Ship,
            Island,
            CollectionSale,
            Marketplace
        });

        await this.blockchainEventsProcessor.syncMarketplaceState(MarketplaceState.LISTED);
        await this.blockchainEventsProcessor.syncMarketplaceState(MarketplaceState.SOLD);

        this.cronosProvider.captainCollectionSaleContract.on(CronosProvider.EventNftMinted, async (
            id: number,
            owner: string
        ) => {
            await this.blockchainEventsProcessor.processNftListedEvent(NftType.CAPTAIN, {
                nftId: id,
                owner: CronosConstants.CaptainMarketplaceContractAddress,
                seller: owner
            });
        });

        this.cronosProvider.captainMarketplaceContract.on(CronosProvider.EventNftListed, async (
            nftId: number,
            seller: string,
            owner: string,
            price: number
        ) => {
            await this.blockchainEventsProcessor.processNftListedEvent(NftType.CAPTAIN, {
                nftId,
                owner,
                seller,
                price
            });
        });

        this.cronosProvider.captainMarketplaceContract.on(CronosProvider.EventNftDelisted, async (
            nftId: number,
            seller: string,
        ) => {
            await this.blockchainEventsProcessor.processNftDelistedEvent(NftType.CAPTAIN, {
                nftId,
                seller
            });
        });

        this.cronosProvider.captainMarketplaceContract.on(CronosProvider.EventNftSold, async (
            nftId: number,
            seller: string,
            owner: string,
            price: number
        ) => {
            await this.blockchainEventsProcessor.processNftSoldEvent(NftType.CAPTAIN, {
                nftId,
                seller,
                owner,
                price
            });
        });
    }

    checkEthersAuthSignature(request: CheckEthersAuthSignatureRequest) {
        const signerAddr = ethers.utils.verifyMessage(Constants.AuthSignatureTemplate.replace('@', request.address), request.signedMessage)
        return {
            success: signerAddr == request.address
        } as CheckEthersAuthSignatureResponse;
    }

}