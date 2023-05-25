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
import { CronosProvider } from '@app/shared-library/blockchain/cronos/cronos.provider';
import { WorkersMint } from '@app/shared-library/workers/workers.mint';
import { WorkersMarketplace } from '@app/shared-library/workers/workers.marketplace';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MarketplaceState } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { BlockchainBaseProcessor } from '@app/shared-library/blockchain/blockchain.base.provider';
import { SharedLibraryService } from '@app/shared-library';
import { CronosConstants } from '@app/shared-library/blockchain/cronos/cronos.constants';

const { NftContractAbi } = require('../abi/NftContract.js');
const { CollectionContractAbi } = require('../abi/CollectionContract.js');
const { MarketplaceContractAbi } = require('../abi/MarketplaceContract.js');

@Injectable()
export class BlockchainServiceCronos implements OnModuleInit {

    private readonly cronosProvider = new CronosProvider();
    private readonly blockchainBaseProcessor: BlockchainBaseProcessor;

    constructor(
        @InjectQueue(WorkersMint.CronosMintQueue) mintQueue: Queue,
        @InjectQueue(WorkersMarketplace.CronosMarketplaceUpdateQueue) marketplaceUpdateQueue: Queue,
        @InjectQueue(WorkersMarketplace.CronosMarketplaceListingQueue) marketplaceListingQueue: Queue,
        @InjectQueue(WorkersMarketplace.CronosMarketplaceSoldQueue) marketplaceSoldQueue: Queue
    ) {
        Logger.log('BlockchainServiceCronos constructor 1');
        this.blockchainBaseProcessor = new BlockchainBaseProcessor(
            SharedLibraryService.CRONOS_CHAIN_NAME,
            mintQueue,
            marketplaceUpdateQueue,
            marketplaceListingQueue,
            marketplaceSoldQueue
        );
        Logger.log('BlockchainServiceCronos constructor 2');
    }

    async onModuleInit() {
        Logger.log('BlockchainServiceCronos onModuleInit 1');
        await this.cronosProvider.init(
            NftContractAbi,
            CollectionContractAbi,
            MarketplaceContractAbi
        );
        Logger.log('BlockchainServiceCronos onModuleInit 2');
        // await this.blockchainBaseProcessor.syncMarketplaceState(MarketplaceState.LISTED);
        // await this.blockchainBaseProcessor.syncMarketplaceState(MarketplaceState.SOLD);
        this.cronosProvider.captainCollectionContract.on(CronosProvider.EventNftMinted, async (
            id: any,
            owner: string
        ) => {
            Logger.log('Captains mint occured:');
            Logger.log({ id, owner });
            await this.blockchainBaseProcessor.processNftListedEvent(NftType.CAPTAIN, {
                nftId: id.toNumber(),
                owner: CronosConstants.CaptainMarketplaceContractAddress,
                seller: owner
            });
        });

        this.cronosProvider.captainMarketplaceContract.on(CronosProvider.EventNftListed, async (
            nftId: any,
            seller: string,
            owner: string,
            price: any
        ) => {
            Logger.log('Captains lising occured:');
            Logger.log({ nftId: nftId.toNumber(), seller, owner, price: price.toNumber() });

            // await this.blockchainBaseProcessor.processNftListedEvent(NftType.CAPTAIN, {
            //     nftId,
            //     owner,
            //     seller,
            //     price
            // });
        });

        this.cronosProvider.captainMarketplaceContract.on(CronosProvider.EventNftDelisted, async (
            nftId: any,
            seller: string,
        ) => {
            Logger.log('Captains delisting occured:');
            Logger.log({ nftId: nftId.toNumber(), seller });

            // await this.blockchainBaseProcessor.processNftDelistedEvent(NftType.CAPTAIN, {
            //     nftId,
            //     seller
            // });
        });

        this.cronosProvider.captainMarketplaceContract.on(CronosProvider.EventNftSold, async (
            nftId: any,
            seller: string,
            owner: string,
            price: any
        ) => {
            Logger.log('Captain sold occured:');
            Logger.log({ nftId: nftId.toNumber(), seller, owner, price: price.toNumber() });

            // await this.blockchainBaseProcessor.processNftSoldEvent(NftType.CAPTAIN, {
            //     nftId,
            //     seller,
            //     owner,
            //     price
            // });
        });

        Logger.log('BlockchainServiceCronos onModuleInit 3');
    }

    checkEthersAuthSignature(request: CheckEthersAuthSignatureRequest) {
        const signerAddr = ethers.utils.verifyMessage(Constants.AuthSignatureTemplate.replace('@', request.address), request.signedMessage)
        return {
            success: signerAddr == request.address
        } as CheckEthersAuthSignatureResponse;
    }

}