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
import { Contract } from 'ethers';
import { NftType, Rarity } from '@app/shared-library/shared-library.main';
import { InjectModel } from '@nestjs/mongoose';
import { Collection, CollectionDocument } from '@app/shared-library/schemas/marketplace/schema.collection';
import { CollectionItem, CollectionItemDocument, MarketplaceState } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { MarketplaceUpdateJob, WorkersMarketplace } from "@app/shared-library/workers/workers.marketplace";
import { Mint, MintDocument } from '@app/shared-library/schemas/marketplace/schema.mint';
import { Model } from 'mongoose';
import { NftCaptainGenerator } from './nft/nft.generator.captain.base';
import { EthersConstants } from '@app/shared-library/ethers/ethers.constants';

@Processor(WorkersMarketplace.MarketplaceUpdateQueue)
export class QueueMarketplaceUpdateProcessor implements OnModuleInit {

    private readonly logger = new Logger(QueueMarketplaceUpdateProcessor.name);
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
    async process(job: Job<MarketplaceUpdateJob>) {
        let marketplaceContract = this.ethersProvider.captainMarketplaceContract;
        let entityAddress = this.ethersProvider.captainContract.address;

        switch (job.data.nftType) {
            case NftType.SHIP:
                marketplaceContract = this.ethersProvider.shipMarketplaceContract;
                entityAddress = this.ethersProvider.shipContract.address;
                break;
            case NftType.ISLAND:
                marketplaceContract = this.ethersProvider.islandMarketplaceContract;
                entityAddress = this.ethersProvider.islandContract.address;
                break;
        }


        if (job.data.marketplaceState == MarketplaceState.NONE) {
            await this.updateNfts(entityAddress);
        } else {
            await this.updateSaleCollections(entityAddress);
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
                            marketplaceState: {
                                "$in": [MarketplaceState.NONE, MarketplaceState.LISTED]
                            }
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
                                collectionItem.traits = body.attributes[0].traits;
                                collectionItem.visuals = NftCaptainGenerator.GenerateVisuals(body);
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
                            model.traits = body.attributes[0].traits;
                            model.visuals = NftCaptainGenerator.GenerateVisuals(body);

                            let rarity = 'Common';
                            switch (body.attributes[3].rarity) {
                                case Rarity.LEGENDARY:
                                    rarity = 'Legendary';
                                    break;
                                case Rarity.EPIC:
                                    rarity = 'Epic';
                                    break;
                                case Rarity.RARE:
                                    rarity = 'Rare';
                                    break;
                            }

                            model.rarity = rarity;
                            model.contractAddress = contractAddress;
                            model.marketplaceState = MarketplaceState.NONE;
                            model.lastUpdated = Number((Date.now() / 1000).toFixed(0));
                            model.collectionName = 'captains';
                            model.coinSymbol = 'CRO';
                            model.chainName = 'Cronos';
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

        if (nfts && nfts.length > 0) {
            // Convert each NFT from the blockchain
            const marketplaceNFTs: MarketplaceNFT[] = nfts.filter(nft => nft.tokenId != 0).map(nft => {
                const marketplaceNFT: MarketplaceNFT = {
                    contractAddress: EthersConstants.CaptainContractAddress,
                    tokenId: nft.tokenId.toNumber(),
                    tokenUri: nft.tokenUri,
                    seller: nft.seller.toLowerCase(),
                    owner: nft.owner.toLowerCase(),
                    price: nft.price.toNumber(),
                    image: '',
                    traits: {},
                    visuals: [],
                    rarity: 'Common',
                    lastUpdated: nft.lastUpdated.toNumber()
                };
                return marketplaceNFT;
            });

            const contractAddress = marketplaceNFTs[0].contractAddress;

            if (marketplaceNFTs.length > 0) {
                // Find all collection item Id for this collection
                const collectionItems = await this.collectionItemModel.find({
                    contractAddress
                });
                const tokenIds = collectionItems.map(f => {
                    return f.tokenId;
                });

                // Fill fields that requires metadata parsing if needed
                for (const nft of marketplaceNFTs) {
                    if (!tokenIds.includes(nft.tokenId)) {
                        const response = await fetch(nft.tokenUri);
                        const body = await response.json();
                        nft.image = body.image;
                        nft.traits = body.attributes[0].traits;
                        nft.visuals = NftCaptainGenerator.GenerateVisuals(body);
                        let rarity = 'Common';
                        switch (body.attributes[3].rarity) {
                            case Rarity.LEGENDARY:
                                rarity = 'Legendary';
                                break;
                            case Rarity.EPIC:
                                rarity = 'Epic';
                                break;
                            case Rarity.RARE:
                                rarity = 'Rare';
                                break;
                        }
                        nft.rarity = rarity;
                    }
                }

                const self = this;
                async function createNewCollectionItem(nft: MarketplaceNFT) {
                    const model = new self.collectionItemModel();
                    model.id = nft.contractAddress + '_' + nft.tokenId;
                    model.tokenId = nft.tokenId;
                    model.tokenUri = nft.tokenUri;
                    if (marketplaceState == MarketplaceState.LISTED) {
                        model.owner = nft.seller.toLowerCase();
                    } else {
                        model.seller = nft.seller.toLowerCase();
                        model.owner = nft.owner.toLowerCase();
                    }
                    model.price = Number(nft.price);

                    if (!tokenIds.includes(nft.tokenId)) {
                        model.image = nft.image;
                    } else {
                        const collectionItem = collectionItems.filter(f => f.tokenId == nft.tokenId)[0];
                        if (collectionItem) {
                            model.image = collectionItem.image;
                        }
                    }

                    model.lastUpdated = Number((Date.now() / 1000).toFixed(0));
                    model.contractAddress = nft.contractAddress;
                    model.traits = nft.traits;
                    model.visuals = nft.visuals;
                    model.rarity = nft.rarity;
                    model.marketplaceState = marketplaceState == MarketplaceState.LISTED ? MarketplaceState.LISTED : MarketplaceState.SOLD;
                    model.collectionName = 'captains';
                    model.coinSymbol = 'CRO';
                    model.chainName = 'Cronos';
                    model.chainId = '338';
                    console.log('getMarketplaceNfts. Saved.');
                    await model.save();
                }

                // Create missing NFT or update existing
                for (const nft of marketplaceNFTs) {
                    if (tokenIds.includes(nft.tokenId)) {

                        // Create sold item if we dont have it yet
                        if (marketplaceState == MarketplaceState.SOLD && collectionItems.filter(f => f.tokenId == nft.tokenId && f.marketplaceState == MarketplaceState.SOLD).length == 0) {
                            this.logger.log(`Create new sold NFT: contractAddress: ${nft.contractAddress}, tokenId: ${nft.tokenId}`);
                            await createNewCollectionItem(nft);
                        }

                        // Change state and add price if we dont have listed NFT yet
                        if (marketplaceState == MarketplaceState.LISTED && collectionItems.filter(f => f.tokenId == nft.tokenId && f.marketplaceState == MarketplaceState.LISTED).length == 0) {
                            const filteredListedItems = collectionItems.filter(f => f.tokenId == nft.tokenId && f.marketplaceState == MarketplaceState.NONE);
                            if (filteredListedItems.length == 1) {
                                const filteredListedItem = filteredListedItems[0];
                                filteredListedItem.price = Number(nft.price);
                                filteredListedItem.marketplaceState = MarketplaceState.LISTED;
                                this.logger.log(`Update missing Listed state: contractAddress: ${nft.contractAddress}, tokenId: ${nft.tokenId}`);
                                await filteredListedItem.save();
                            } else {
                                this.logger.error(`Unable to update listed NFT: contractAddress: ${nft.contractAddress}, tokenId: ${nft.tokenId}`);
                            }
                        }
                    } else {
                        this.logger.log(`Create missing NFT: contractAddress: ${nft.contractAddress}, tokenId: ${nft.tokenId}`);
                        await createNewCollectionItem(nft);
                    }
                }
            } else {
                // If we have listed NFT, but no listed in the contract
                if (marketplaceState == MarketplaceState.LISTED) {
                    const collectionItems = await this.collectionItemModel.find({
                        contractAddress,
                        marketplaceState: MarketplaceState.LISTED
                    });
                    if (collectionItems.length > 0) {
                        for (const collectionItem of collectionItems) {
                            collectionItem.marketplaceState = MarketplaceState.NONE;
                            this.logger.log(`Creaye missing NFT: contractAddress: ${contractAddress}, tokenId: ${collectionItem.tokenId}`);
                            await collectionItem.save();
                        }
                    }
                }
            }
        }
    }

    private async updateSaleCollections(contractAddress: string) {
        const collection = await this.collectionModel.findOne({ contractAddress }).populate('mint');
        if (collection && collection.collectionItemsLeft > 0) {
            let tokensLeft = 0;
            if (collection.name == 'Captains') {
                tokensLeft = (await this.ethersProvider.captainCollectionSaleContract.tokensLeft()).toNumber();
            }
            if (tokensLeft > 0) {
                collection.collectionItemsLeft = tokensLeft;
                await collection.save();
                const collectionMint = await this.mintModel.findById(collection.mint);
                if (collectionMint) {
                    collectionMint.collectionItemsLeft = tokensLeft;
                    await collectionMint.save();
                } else {
                    Logger.error('Unable to update collection mint tokens. Collection id: ' + collection._id);
                }
            }
        } else {
            Logger.error('Unable to update collection tokens. Collection name: ' + contractAddress);
        }
    }

    @OnQueueError()
    onQueueError(error: Error) {
        this.logger.error(error);
    }

    @OnQueueFailed()
    onQueueFailed(job: Job<MarketplaceUpdateJob>, error: Error) {
        this.logger.error(`Job failed ${this.jobInfo(job)}`, error);
    }

    private jobInfo(job: Job<MarketplaceUpdateJob>) {
        return `${job.id} ${MarketplaceState[job.data.marketplaceState]} ${NftType[job.data.nftType]}`
    }
}