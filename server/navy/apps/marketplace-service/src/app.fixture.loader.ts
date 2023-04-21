import { SharedLibraryService } from "@app/shared-library";
import { CollectionDocument } from "@app/shared-library/schemas/marketplace/schema.collection";
import { CollectionItemDocument, MarketplaceState } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { FaqDocument } from "@app/shared-library/schemas/marketplace/schema.faq";
import { MintDocument } from "@app/shared-library/schemas/marketplace/schema.mint";
import { ProjectDocument } from "@app/shared-library/schemas/marketplace/schema.project";
import { Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { join } from "path";

const fs = require('fs');

export class FixtureLoader {

    private readonly dropTopSalesOnRestart = false;

    constructor(
        private projectModel: Model<ProjectDocument>,
        private collectionModel: Model<CollectionDocument>,
        private mintModel: Model<MintDocument>,
        private collectionItemModel: Model<CollectionItemDocument>,
        private faqModel: Model<FaqDocument>) {
    }

    async loadFixtures() {
        await this.loadProjects();
        await this.loadFaq();
        if (this.dropTopSalesOnRestart) {
            await this.loadTopSales();
        }
    }

    private async loadProjects() {
        const projectDetails = await this.projectModel.findOne();
        if (!projectDetails) {
            this.loadFixture('1_projects.json', async (fixtures: any) => {
                const fixture = fixtures[0];
                const project = new this.projectModel();
                project.name = fixture.name;
                project.active = fixture.active;
                project.state = fixture.state;
                project.supportedChains = fixture.supportedChains;

                this.loadFixture('2_collections.json', async (fixtures: any) => {
                    const collections = [new this.collectionModel(), new this.collectionModel()];

                    for (let i = 0; i < fixtures.length; i++) {
                        collections[i].name = fixtures[i].name;
                        collections[i].description = fixtures[i].description;
                        collections[i].chainId = fixtures[i].chainId;
                        collections[i].contractAddress = fixtures[i].contractAddress.toLowerCase();
                        collections[i].collectionSize = fixtures[i].collectionSize;
                        collections[i].collectionItemsLeft = fixtures[i].collectionItemsLeft;
                        collections[i].preview = fixtures[i].preview;
                    }

                    this.loadFixture('3_mints.json', async (fixtures: any) => {
                        for (let i = 0; i < fixtures.length; i++) {
                            const mint = new this.mintModel();

                            fixtures[i].mintingDetails.forEach(mintingDetail => {
                                mintingDetail.saleContractAddress = mintingDetail.saleContractAddress.toLowerCase();
                                mintingDetail.tokenContractAddress = mintingDetail.tokenContractAddress.toLowerCase();
                            });

                            mint.mintingEnabled = fixtures[i].mintingEnabled;
                            mint.mintingStartTime = fixtures[i].mintingStartTime;
                            mint.mintingEndTime = fixtures[i].mintingEndTime;
                            mint.mintingDetails = fixtures[i].mintingDetails;

                            mint.collectionSize = fixtures[i].collectionSize;
                            mint.collectionItemsLeft = fixtures[i].collectionItemsLeft;
                            mint.collectionPreview = fixtures[i].collectionPreview;

                            mint.descriptionTitle = fixtures[i].descriptionTitle;
                            mint.descriptionDescription = fixtures[i].descriptionDescription;

                            mint.profitability = fixtures[i].profitability;
                            mint.profitabilityTitle = fixtures[i].profitabilityTitle;
                            mint.profitabilityValue = fixtures[i].profitabilityValue;
                            mint.profitabilityDescription = fixtures[i].profitabilityDescription;

                            mint.rarity = fixtures[i].rarity;
                            mint.rarityTitle = fixtures[i].rarityTitle;
                            mint.rarityDescription = fixtures[i].rarityDescription;
                            mint.rarityItems = fixtures[i].rarityItems;

                            mint.nftParts = fixtures[i].nftParts;
                            mint.nftPartsTitle = fixtures[i].nftPartsTitle;
                            mint.nftPartsDescription = fixtures[i].nftPartsDescription;
                            mint.nftPartsItems = fixtures[i].nftPartsItems;

                            collections[i].mint = await mint.save();
                            project.collections.push(await collections[i].save());
                        }

                        await project.save();
                    });
                });
            });

            this.loadFixture('4_collection_items.json', async (fixtures: any) => {
                for (let i = 0; i < fixtures.length; i++) {
                    const collectionItem = new this.collectionItemModel();
                    collectionItem.id = fixtures[i].id;
                    collectionItem.tokenId = fixtures[i].tokenId;
                    collectionItem.tokenUri = fixtures[i].tokenUri;
                    collectionItem.seller = fixtures[i].seller;
                    collectionItem.owner = fixtures[i].owner;
                    collectionItem.price = fixtures[i].price;
                    collectionItem.image = fixtures[i].image;
                    collectionItem.rarity = fixtures[i].rarity;
                    collectionItem.lastUpdated = fixtures[i].lastUpdated;
                    collectionItem.needUpdate = fixtures[i].needUpdate;
                    collectionItem.contractAddress = fixtures[i].contractAddress;
                    collectionItem.chainId = fixtures[i].chainId;
                    collectionItem.chainName = fixtures[i].chainName;
                    collectionItem.coinSymbol = fixtures[i].coinSymbol;
                    collectionItem.marketplaceState = fixtures[i].marketplaceState;
                    await collectionItem.save();
                }
            });
        }
    }

    private async loadTopSales() {
        await this.collectionItemModel.deleteMany({
            marketplaceState: MarketplaceState.SOLD
        });

        const nowTimeSeconds = Number(Number(Date.now() / 1000).toFixed(0));
        const daySeconds = 24 * 60 * 60;
        let nextId = 54;
        let nextTimeSeconds = nowTimeSeconds;
        const defaultCollectionItem = {
            needUpdate: false,
            id: "0x61a03eed4c0220bb6ee89b0cda10dc171f772577_",
            tokenId: 0,
            tokenUri: "https://ipfs.moralis.io:2053/ipfs/QmQmRiVEaAbBnF7rnGNfaTMya2UH7NyRu2HCjc8HvN88R5/nvy/e1b50bc2-37f1-409d-af6a-32ba0b730e6a.json",
            seller: "0xe6193b058bbd559e8e0df3a48202a3cdec852ab6",
            owner: "0xac256b90b14465c37f789e16eb5efe0233bafe87",
            price: 10,
            image: "https://ipfs.moralis.io:2053/ipfs/QmVVqX2G1Rct5oCXqmCw3SeG3fzR6moJgtEVJs2QBoCbXX/nvy/e1b50bc2-37f1-409d-af6a-32ba0b730e6a.png",
            rarity: "Common",
            lastUpdated: 0,
            visuals: [],
            traits: [],
            contractAddress: "0x61a03eed4c0220bb6ee89b0cda10dc171f772577",
            marketplaceState: 1,
            chainId: "338"
        };

        function generateCaptainVisuals() {
            return [
                {
                    trait_type: 'Accessories',
                    value: 'Scarf'
                },
                {
                    trait_type: 'Background',
                    value: 'Purple'
                },
                {
                    trait_type: 'Body',
                    value: 'Body 1'
                },
                {
                    trait_type: 'Clothes',
                    value: 'Jacket'
                },
                {
                    trait_type: 'Head',
                    value: 'Hair 1'
                },
                {
                    trait_type: 'Face',
                    value: 'Upset'
                }
            ]
        }

        function generateCaptainTraits() {
            return [
                {
                    trait_type: 'Ship bonus 1',
                    value: '1'
                }
            ]
        }

        // Today sells
        for (let i = 0; i < 20; i++) {
            defaultCollectionItem.id += nextId;
            defaultCollectionItem.tokenId = nextId;
            defaultCollectionItem.lastUpdated = nextTimeSeconds;
            defaultCollectionItem.visuals = generateCaptainVisuals();
            defaultCollectionItem.traits = generateCaptainTraits();

            let price = SharedLibraryService.GetRandomIntInRange(1, 1000);
            let priceFloat = SharedLibraryService.GetRandomIntInRange(0, 1);
            let finalPrice = String(price);
            if (priceFloat == 1) {
                finalPrice += '.' + SharedLibraryService.GetRandomIntInRange(1, 99);
            }
            defaultCollectionItem.price = Number(finalPrice);

            await new this.collectionItemModel(defaultCollectionItem).save();
            nextId++;
            nextTimeSeconds -= 60 * 30;
        }
        nextTimeSeconds = nowTimeSeconds;

        // 7d
        for (let i = 0; i < 20; i++) {
            defaultCollectionItem.id += nextId;
            defaultCollectionItem.tokenId = nextId;
            defaultCollectionItem.lastUpdated = nextTimeSeconds;
            defaultCollectionItem.visuals = generateCaptainVisuals();
            defaultCollectionItem.traits = generateCaptainTraits();

            let price = SharedLibraryService.GetRandomIntInRange(1, 1000);
            let priceFloat = SharedLibraryService.GetRandomIntInRange(0, 1);
            let finalPrice = String(price);
            if (priceFloat == 1) {
                finalPrice += '.' + SharedLibraryService.GetRandomIntInRange(1, 99);
            }
            defaultCollectionItem.price = Number(finalPrice);

            await new this.collectionItemModel(defaultCollectionItem).save();
            nextId++;
            nextTimeSeconds -= (60 * 60) * 10;
        }
        nextTimeSeconds = nowTimeSeconds;

        // 30d 
        for (let i = 0; i < 20; i++) {
            defaultCollectionItem.id += nextId;
            defaultCollectionItem.tokenId = nextId;
            defaultCollectionItem.lastUpdated = nextTimeSeconds;
            defaultCollectionItem.visuals = generateCaptainVisuals();
            defaultCollectionItem.traits = generateCaptainTraits();

            let price = SharedLibraryService.GetRandomIntInRange(1, 1000);
            let priceFloat = SharedLibraryService.GetRandomIntInRange(0, 1);
            let finalPrice = String(price);
            if (priceFloat == 1) {
                finalPrice += '.' + SharedLibraryService.GetRandomIntInRange(1, 99);
            }
            defaultCollectionItem.price = Number(finalPrice);

            await new this.collectionItemModel(defaultCollectionItem).save();
            nextId++;
            nextTimeSeconds -= daySeconds;
        }
    }

    private async loadFaq() {
        const faq = await this.faqModel.findOne();
        if (!faq) {
            this.loadFixture('5_faq.json', async (fixtures: any) => {
                const newFaq = new this.faqModel();
                const questionsAndAnswers = [];
                for (const fixture of fixtures) {
                    questionsAndAnswers.push(fixture);
                }
                newFaq.questionsAndAnswers = questionsAndAnswers;
                await newFaq.save();
            });
        }
    }

    private loadFixture(fixtureName: string, callback: Function) {
        try {
            fs.readFile(join(__dirname, '..', 'marketplace-service') + '/fixtures/' + fixtureName, async (error: any, data: any) => {
                if (error) {
                    Logger.error('Unable to load ' + fixtureName + ' fixture!', error);
                } else {
                    const fixture = JSON.parse(data);
                    Logger.log(fixtureName + ' loaded!');
                    callback(fixture);
                }
            });
        } catch (error) {
            Logger.error('Unable to load ' + fixtureName + ' fixture!', error);
        }
    }

}