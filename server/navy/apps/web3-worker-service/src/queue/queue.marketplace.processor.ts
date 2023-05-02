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
import { OnQueueError, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { Logger, OnModuleInit } from "@nestjs/common";
import { Job } from "bull";
import { Contract, ethers } from 'ethers';
import { NftType } from '@app/shared-library/shared-library.main';
import { InjectModel } from '@nestjs/mongoose';
import { Collection, CollectionDocument } from '@app/shared-library/schemas/marketplace/schema.collection';
import { CollectionItem, CollectionItemDocument, MarketplaceState } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { UpdateMarketplaceJob, WorkersMarketplace } from "@app/shared-library/workers/workers.marketplace";
import { Mint, MintDocument } from '@app/shared-library/schemas/marketplace/schema.mint';
import { Model } from 'mongoose';

@Processor(WorkersMarketplace.UpdateMarketplaceQueue)
export class QueueMarketplaceProcessor implements OnModuleInit {

    private readonly logger = new Logger(QueueMarketplaceProcessor.name);
    private readonly ethersProvider = new EthersProvider();

    constructor(
        @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
        @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>,
        @InjectModel(Mint.name) private mintModel: Model<MintDocument>) {
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
        let contractAddressAddress = this.ethersProvider.captainContract.address;

        switch (job.data.nftType) {
            case NftType.SHIP:
                marketplaceContract = this.ethersProvider.shipMarketplaceContract;
                contractAddressAddress = this.ethersProvider.shipContract.address;
                break;
            case NftType.ISLAND:
                marketplaceContract = this.ethersProvider.islandMarketplaceContract;
                contractAddressAddress = this.ethersProvider.islandContract.address;
                break;
        }

        if (job.data.marketplaceState == MarketplaceState.NONE) {
            await this.updateNfts(contractAddressAddress);
        } else {
            await this.updateSaleCollections(contractAddressAddress);
            await this.getMarketplaceNfts(marketplaceContract, MarketplaceState.LISTED);
            await this.getMarketplaceNfts(marketplaceContract, MarketplaceState.SOLD);
        }
    }

    private async updateNfts(contractAddress: string) {
        const collection = await this.collectionModel.findOne({ address: contractAddress });
        if (collection) {
            let contract: Contract;
            if (collection.name == 'Captains') {
                contract = this.ethersProvider.captainContract;
            }
            if (contract) {
                const totalSupply = (await this.ethersProvider.captainContract.totalSupply()).toNumber();
                if (totalSupply > 0) {
                    for (let i = 1; i < totalSupply + 1; i++) {
                        const collectionItem = await this.collectionItemModel.findOne({
                            contractAddress,
                            tokenId: i,
                            marketplaceState: MarketplaceState.NONE
                        });

                        const nftOwner = (await this.ethersProvider.captainContract.ownerOf(i)).toLowerCase();
                        const nftUri = await this.ethersProvider.captainContract.tokenURI(i);

                        if (collectionItem) {
                            let nftChanged = false;
                            if (collectionItem.tokenUri != nftUri) {
                                collectionItem.tokenUri = nftUri;
                                const uriResponse = await fetch(nftUri);
                                const body = await uriResponse.json();
                                collectionItem.image = body.image;
                                nftChanged = true;
                            }
                            if (collectionItem.owner != nftOwner) {
                                collectionItem.owner = nftOwner;
                                nftChanged = true;
                            }
                            if (nftChanged) {
                                await collectionItem.save();
                            }
                        } else {
                            const uriResponse = await fetch(nftUri);
                            const body = await uriResponse.json();

                            const model = new this.collectionItemModel();
                            model.id = contractAddress + '_' + i;
                            model.tokenId = i;
                            model.tokenUri = nftUri;
                            model.owner = nftOwner;
                            model.image = body.image;
                            model.contractAddress = contractAddress;
                            model.marketplaceState = MarketplaceState.NONE;
                            model.chainId = '338';
                            await model.save();
                        }
                    }
                }
            }
        }
    }

    private async getMarketplaceNfts(marketpalceContract: Contract, marketplaceState: MarketplaceState) {
        const nfts = marketplaceState == MarketplaceState.LISTED ?
            await marketpalceContract.getNftsListed() : await marketpalceContract.getNftsSold();

        const marketplaceNFTs: MarketplaceNFT[] = nfts.map(nft => {
            const marketplaceNFT: MarketplaceNFT = {
                contractAddress: nft.contractAddress.toLowerCase(),
                tokenId: nft.tokenId.toNumber(),
                tokenUri: nft.tokenUri,
                seller: nft.seller.toLowerCase(),
                owner: nft.owner.toLowerCase(),
                price: ethers.utils.formatEther(nft.price),
                image: '',
                lastUpdated: nft.lastUpdated.toNumber()
            };
            return marketplaceNFT;
        });

        if (marketplaceNFTs.length > 0) {
            const contractAddress = marketplaceNFTs[0].contractAddress;

            // Skip nfts that we have already
            const collectionItems = await this.collectionItemModel.find({
                contractAddress
            });
            const tokenIds = collectionItems.map(f => {
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
                model.id = nft.contractAddress + '_' + nft.tokenId;
                model.tokenId = nft.tokenId;
                model.tokenUri = nft.tokenUri;
                model.seller = nft.seller;
                model.owner = nft.owner;
                model.price = Number(nft.price);
                model.image = nft.image;
                model.lastUpdated = nft.lastUpdated;
                model.contractAddress = nft.contractAddress;
                model.marketplaceState = marketplaceState == MarketplaceState.LISTED ? MarketplaceState.LISTED : MarketplaceState.SOLD;
                model.chainId = '338';
                await model.save();
            }
        }
    }

    private async updateSaleCollections(address: string) {
        const collection = await this.collectionModel.findOne({ address }).populate('mint');
        if (collection && collection.collectionItemsLeft > 0) {
            let tokensLeft = 0;
            if (collection.name == 'Captains') {
                tokensLeft = (await this.ethersProvider.captainCollectionSaleContract.tokensLeft()).toNumber();
            }
            if (tokensLeft > 0) {
                collection.collectionItemsLeft = tokensLeft;
                collection.save();

                const collectionMint = await this.mintModel.findById(collection.mint);
                if (collectionMint) {
                    collectionMint.collectionItemsLeft = tokensLeft;
                    await collectionMint.save();
                } else {
                    Logger.error('Unable to update collection mint tokens. Collection id: ' + collection._id);
                }
            }
        } else {
            Logger.error('Unable to update collection tokens. Collection name: ' + address);
        }
    }

    @OnQueueError()
    onQueueError(error: Error) {
        this.logger.error(error);
    }

    @OnQueueFailed()
    onQueueFailed(job: Job<UpdateMarketplaceJob>, error: Error) {
        this.logger.error(`Job failed ${this.jobInfo(job)}`, error);
    }

    private jobInfo(job: Job<UpdateMarketplaceJob>) {
        return `${job.id} ${MarketplaceState[job.data.marketplaceState]} ${NftType[job.data.nftType]}`
    }
}