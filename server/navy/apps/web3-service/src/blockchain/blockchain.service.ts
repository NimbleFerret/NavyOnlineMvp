import * as Captain from '../abi/Captain.json';
import * as Aks from '../abi/Aks.json';
import * as Nvy from '../abi/Nvy.json';
import * as Ship from '../abi/Ship.json';
import * as Island from '../abi/Island.json';
import * as ShipTemplate from '../abi/ShipTemplate.json';
import * as CollectionSale from '../abi/CollectionSale.json';
import * as Marketplace from '../abi/Marketplace.json';
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
import { EthersProvider } from '@app/shared-library/ethers/ethers.provider';
import { MintJob, WorkersMint } from '@app/shared-library/workers/workers.mint';
import {
    MarketplaceUpdateJob,
    MarketplaceListingJob,
    WorkersMarketplace,
} from '@app/shared-library/workers/workers.marketplace';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MarketplaceState } from '@app/shared-library/schemas/marketplace/schema.collection.item';

@Injectable()
export class BlockchainService implements OnModuleInit {

    private readonly ethersProvider = new EthersProvider();

    constructor(
        @InjectQueue(WorkersMarketplace.MarketplaceUpdateQueue) private readonly marketplaceUpdateQueue: Queue,
        @InjectQueue(WorkersMarketplace.MarketplaceListingQueue) private readonly marketplaceListingQueue: Queue,
        @InjectQueue(WorkersMint.MintQueue) private readonly mintQueue: Queue) { }

    async onModuleInit() {
        await this.ethersProvider.init({
            Captain,
            Aks,
            Nvy,
            Ship,
            Island,
            ShipTemplate,
            CollectionSale,
            Marketplace
        });

        // await this.syncSaleContracts();
        // await this.syncNftContracts();

        this.mintQueue.add({
            nftType: NftType.CAPTAIN,
            sender: '0xE6193b058bBD559E8E0Df3a48202a3cDEC852Ab6',
            contractAddress: '0xA7D87Ec62772c3cB9b59de6f4ACa4c8602910bcd'
        } as MintJob);

        this.ethersProvider.captainCollectionSaleContract.on(EthersProvider.EventGenerateToken, async (sender: string, contractAddress: string) => {
            Logger.log(`Captains mint occured! sender: ${sender}, contractAddress: ${contractAddress}`);
            this.mintQueue.add({
                nftType: NftType.CAPTAIN,
                sender,
                contractAddress
            } as MintJob);
        });

        this.ethersProvider.captainMarketplaceContract.on(EthersProvider.EventNFTListed, async (
            nftContract: string,
            tokenId: number,
            tokenUri: string,
            seller: string,
            owner: string,
            price: number
        ) => {
            Logger.log(`Captain listed on the marketplace! nftContract: ${nftContract}, tokenId: ${tokenId}, seller: ${seller}, owner: ${owner}, price: ${price}`);
            this.marketplaceListingQueue.add({
                contractAddress: nftContract.toLowerCase(),
                tokenId: Number(tokenId),
                listed: true,
                price: Number(price),
                nftType: NftType.CAPTAIN
            } as MarketplaceListingJob)
        });

        this.ethersProvider.captainMarketplaceContract.on(EthersProvider.EventNFTDelisted, async (
            tokenId: number,
            nftContract: string,
            seller: string,
        ) => {
            Logger.log(`Captain delisted from the marketplace! nftContract: ${nftContract}, tokenId: ${tokenId}, seller: ${seller}`);
            this.marketplaceListingQueue.add({
                contractAddress: nftContract.toLowerCase(),
                tokenId: Number(tokenId),
                listed: false,
                nftType: NftType.CAPTAIN
            } as MarketplaceListingJob)
        });

        this.ethersProvider.captainMarketplaceContract.on(EthersProvider.EventNFTSold, async (
            nftContract: string,
            tokenId: number,
            seller: string,
            owner: string,
            price: number
        ) => {
            Logger.log(`Captain sold on the marketplace! nftContract: ${nftContract}, tokenId: ${tokenId}, seller: ${seller}, owner: ${owner}, price: ${price}`);
            this.marketplaceListingQueue.add({
                contractAddress: nftContract.toLowerCase(),
                tokenId: Number(tokenId),
                listed: true,
                sold: true,
                price: Number(ethers.utils.formatEther(price)),
                nftType: NftType.CAPTAIN,
                seller,
                owner
            } as MarketplaceListingJob)
        });
    }

    checkEthersAuthSignature(request: CheckEthersAuthSignatureRequest) {
        const signerAddr = ethers.utils.verifyMessage(Constants.AuthSignatureTemplate.replace('@', request.address), request.signedMessage)
        return {
            success: signerAddr == request.address
        } as CheckEthersAuthSignatureResponse;
    }

    // TODO better to listen for events
    // @Cron(CronExpression.EVERY_5_MINUTES)
    async syncSaleContracts() {
        this.marketplaceUpdateQueue.empty();
        this.marketplaceUpdateQueue.add({
            marketplaceState: MarketplaceState.LISTED,
            nftType: NftType.CAPTAIN
        } as MarketplaceUpdateJob);
    }

    // @Cron(CronExpression.EVERY_10_MINUTES)
    async syncNftContracts() {
        this.marketplaceUpdateQueue.empty();
        this.marketplaceUpdateQueue.add({
            marketplaceState: MarketplaceState.NONE,
            nftType: NftType.CAPTAIN
        } as MarketplaceUpdateJob);
    }

}