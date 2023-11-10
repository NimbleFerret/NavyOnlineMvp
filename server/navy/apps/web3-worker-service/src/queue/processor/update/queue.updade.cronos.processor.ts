import * as CaptainAbi from '../../../abi/Captain.json';
import * as CollectionAbi from '../../../abi/CollectionSale.json';
import * as MarketplaceAbi from '../../../abi/Marketplace.json';
import { CronosProvider } from "@app/shared-library/blockchain/cronos/cronos.provider";
import { Collection, CollectionDocument } from "@app/shared-library/schemas/marketplace/schema.collection";
import { CollectionItem, CollectionItemDocument, MarketplaceState } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { NftType, Rarity } from "@app/shared-library/shared-library.main";
import { SharedLibraryService } from "@app/shared-library/shared-library.service";
import { MarketplaceUpdateJob, WorkersMarketplace } from "@app/shared-library/workers/workers.marketplace";
import { Process, Processor } from "@nestjs/bull";
import { OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Contract } from "ethers";
import { Model } from "mongoose";
import { NftGeneratorCaptainBase } from "../../nft/nft.generator.captain.base";
import { Job } from 'bull';

@Processor(WorkersMarketplace.CronosMarketplaceUpdateQueue)
export class QueueUpdateCronosProcessor implements OnModuleInit {

    private readonly cronosProvider = new CronosProvider();

    constructor(
        @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
        @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>
    ) {

    }

    async onModuleInit() {
        await this.cronosProvider.init(CaptainAbi, CollectionAbi, MarketplaceAbi);
    }

    @Process()
    async process(job: Job<MarketplaceUpdateJob>) {
        let marketplaceContract = this.cronosProvider.captainMarketplaceContract;
        let entityAddress = this.cronosProvider.captainContract.address;

        switch (job.data.nftType) {
            case NftType.SHIP:
                marketplaceContract = this.cronosProvider.shipMarketplaceContract;
                entityAddress = this.cronosProvider.shipContract.address;
                break;
            case NftType.ISLAND:
                marketplaceContract = this.cronosProvider.islandMarketplaceContract;
                entityAddress = this.cronosProvider.islandContract.address;
                break;
        }

        console.log('QueueUpdateCronosProcessor JOB is here');

        // if (job.data.marketplaceState == MarketplaceState.NONE) {
        //     await this.updateNfts(entityAddress);
        // } else {
        // await this.updateSaleCollections(entityAddress);
        // await this.getMarketplaceNfts(marketplaceContract, MarketplaceState.LISTED);
        // await this.getMarketplaceNfts(marketplaceContract, MarketplaceState.SOLD);
        // }
    }


    private async updateNfts(contractAddress: string) {
        const collection = await this.collectionModel.findOne({ address: contractAddress });

        if (collection) {
            let contract: Contract;
            if (collection.name == 'Captains') {
                contract = this.cronosProvider.captainContract;
            }
            if (contract) {
                const totalSupply = (await this.cronosProvider.captainContract.totalSupply()).toNumber();
                if (totalSupply > 0) {
                    for (let i = 1; i < totalSupply + 1; i++) {
                        const collectionItem = await this.collectionItemModel.findOne({
                            contractAddress,
                            tokenId: i,
                            marketplaceState: {
                                "$in": [MarketplaceState.NONE, MarketplaceState.LISTED]
                            }
                        });

                        const nftOwner = (await this.cronosProvider.captainContract.ownerOf(i)).toLowerCase();
                        const nftUri = await this.cronosProvider.captainContract.tokenURI(i);

                        if (collectionItem) {
                            let nftChanged = false;
                            if (collectionItem.tokenUri != nftUri) {
                                collectionItem.tokenUri = nftUri;
                                const uriResponse = await fetch(nftUri);
                                const body = await uriResponse.json();
                                collectionItem.image = body.image;
                                collectionItem.traits = body.attributes[0].traits;
                                collectionItem.visuals = NftGeneratorCaptainBase.GenerateVisuals(SharedLibraryService.CRONOS_CHAIN_NAME, body);
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
                            model.visuals = NftGeneratorCaptainBase.GenerateVisuals(SharedLibraryService.CRONOS_CHAIN_NAME, body);

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
                            model.tokenSymbol = 'CRO';
                            model.chainName = 'Cronos';
                            model.chainId = '338';
                            await model.save();
                        }
                    }
                }
            }
        }
    }
}