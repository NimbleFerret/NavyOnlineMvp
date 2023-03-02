import * as Captain from '../abi/Captain.json';
import * as Aks from '../abi/Aks.json';
import * as Nvy from '../abi/Nvy.json';
import * as Ship from '../abi/Ship.json';
import * as Island from '../abi/Island.json';
import * as ShipTemplate from '../abi/ShipTemplate.json';
import * as CollectionSale from '../abi/CollectionSale.json';
import * as Marketplace from '../abi/Marketplace.json';

import { MarketplaceNFT } from "@app/shared-library/entities/entity.marketplace.nft";
import { EthersProvider } from "@app/shared-library/ethers/ethers.provider";
import { MarketplaceNftsType, UpdateMarketplaceJob, WorkersMarketplace } from "@app/shared-library/workers/workers.marketplace";
import { OnQueueActive, OnQueueCompleted, OnQueueError, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { Logger, OnModuleInit } from "@nestjs/common";
import { Job } from "bull";
import { Contract, ethers } from 'ethers';
import { NftType } from '@app/shared-library/shared-library.main';
import { CollectionItem, CollectionItemDocument, MarketplaceState } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Processor(WorkersMarketplace.UpdateMarketplaceQueue)
export class QueueMarketplaceProcessor implements OnModuleInit {

    private readonly logger = new Logger(QueueMarketplaceProcessor.name);
    private readonly ethersProvider = new EthersProvider();

    constructor(@InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>) {
    }

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
    }

    @Process()
    async process(job: Job<UpdateMarketplaceJob>) {
        let marketplaceContract = this.ethersProvider.captainMarketplaceContract;

        switch (job.data.nftType) {
            case NftType.SHIP:
                marketplaceContract = this.ethersProvider.shipMarketplaceContract;
                break;
            case NftType.ISLAND:
                marketplaceContract = this.ethersProvider.islandMarketplaceContract;
                break;
        }

        await this.getMarketplaceNfts(marketplaceContract, job.data.marketplaceNftsType);
        await this.getMarketplaceNfts(this.ethersProvider.captainMarketplaceContract, MarketplaceNftsType.SOLD);
    }

    private async getMarketplaceNfts(marketpalceContract: Contract, marketplaceNftsType: MarketplaceNftsType) {
        const nfts = marketplaceNftsType == MarketplaceNftsType.LISTED ?
            await marketpalceContract.getNftsListed() : await marketpalceContract.getNftsSold();

        const marketplaceNFTs: MarketplaceNFT[] = nfts.map(nft => {
            const marketplaceNFT: MarketplaceNFT = {
                nftContract: nft.nftContract,
                tokenId: nft.tokenId.toNumber(),
                tokenUri: nft.tokenUri,
                seller: nft.seller,
                owner: nft.owner,
                price: ethers.utils.formatEther(nft.price),
                image: '',
                lastUpdated: nft.lastUpdated.toNumber()
            };
            return marketplaceNFT;
        });

        if (marketplaceNFTs.length > 0) {
            const contractAddress = marketplaceNFTs[0].nftContract;

            // Skip nfts that we have already
            const contractItems = await this.collectionItemModel.find({
                contractAddress
            });
            const tokenIds = contractItems.map(f => {
                return f.tokenId;
            });
            const nfts = marketplaceNFTs.filter(f => !tokenIds.includes(f.tokenId));

            // Get image from metadata uri
            for (const nft of nfts) {
                const response = await fetch(nft.tokenUri);
                const body = await response.json();
                nft.image = body.image;
            }

            // Save result into the database
            for (const nft of nfts) {
                const model = new this.collectionItemModel();
                model.id = nft.nftContract + '' + nft.tokenId;
                model.tokenId = nft.tokenId;
                model.tokenUri = nft.tokenUri;
                model.seller = nft.seller;
                model.owner = nft.owner;
                model.price = nft.price;
                model.image = nft.image;
                model.lastUpdated = nft.lastUpdated;
                model.nftContract = nft.nftContract;
                model.marketplaceState = marketplaceNftsType == MarketplaceNftsType.LISTED ? MarketplaceState.LISTED : MarketplaceState.SOLD;
                model.chainId = '338';
                await model.save();
            }
        }
    }

    @OnQueueError()
    onQueueError(error: Error) {
        this.logger.error(error);
    }

    @OnQueueActive()
    onQueueActive(job: Job<UpdateMarketplaceJob>) {
        this.logger.log(`Processing job ${this.jobInfo(job)}`);
    }

    @OnQueueCompleted()
    onQueueCompleted(job: Job<UpdateMarketplaceJob>, result: any) {
        this.logger.log(`Job completed ${this.jobInfo(job)}`);
    }

    @OnQueueFailed()
    onQueueFailed(job: Job<UpdateMarketplaceJob>, error: Error) {
        this.logger.error(`Job failed ${this.jobInfo(job)}`, error);
    }

    private jobInfo(job: Job<UpdateMarketplaceJob>) {
        return `${job.id} ${MarketplaceNftsType[job.data.marketplaceNftsType]} ${NftType[job.data.nftType]}`
    }
}