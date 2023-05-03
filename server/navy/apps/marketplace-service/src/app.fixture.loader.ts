import { SharedLibraryService } from "@app/shared-library";
import { CollectionDocument } from "@app/shared-library/schemas/marketplace/schema.collection";
import { CollectionItemDocument, MarketplaceState } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { FaqDocument } from "@app/shared-library/schemas/marketplace/schema.faq";
import { MintDocument } from "@app/shared-library/schemas/marketplace/schema.mint";
import { ProjectDocument } from "@app/shared-library/schemas/marketplace/schema.project";
import { FileUtils } from "@app/shared-library/shared-library.file.utils";
import { Model } from "mongoose";

export class FixtureLoader {

    private readonly reloadCollectionItems = true;

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
        if (this.reloadCollectionItems) {
            await this.collectionItemModel.deleteMany();
            await this.loadTopSales('captains', '0x61a03eed4c0220bb6ee89b0cda10dc171f772577');
            await this.loadTopSales('ships', '0x61a03eed4c0220bb6ee89b0cda10dc171f772578');
            await this.loadTopSales('islands', '0x61a03eed4c0220bb6ee89b0cda10dc171f772579');
        }
    }

    private async loadProjects() {
        const projectCount = await this.projectModel.count();
        if (projectCount == 0) {
            FileUtils.LoadFixture('marketplace-service', '1_projects.json', async (fixtures: any) => {
                const fixture = fixtures[0];
                const project = new this.projectModel();
                project.name = fixture.name;
                project.active = fixture.active;
                project.state = fixture.state;
                project.supportedChains = fixture.supportedChains;

                FileUtils.LoadFixture('marketplace-service', '2_collections.json', async (fixtures: any) => {
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

                    FileUtils.LoadFixture('marketplace-service', '3_mints.json', async (fixtures: any) => {
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

            FileUtils.LoadFixture('marketplace-service', '4_collection_items.json', async (fixtures: any) => {
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

    private async loadTopSales(collectionName: string, contractAddress: string) {
        const nowTimeSeconds = Number(Number(Date.now() / 1000).toFixed(0));
        const daySeconds = 24 * 60 * 60;
        const itemIdPrefix = '0x61a03eed4c0220bb6ee89b0cda10dc171f772577_';
        let nextId = 54;
        let nextTimeSeconds = nowTimeSeconds;
        let imageIndex = 1;

        const defaultCollectionItem = {
            needUpdate: false,
            id: itemIdPrefix,
            tokenId: 0,
            tokenUri: "https://ipfs.moralis.io:2053/ipfs/QmQmRiVEaAbBnF7rnGNfaTMya2UH7NyRu2HCjc8HvN88R5/nvy/e1b50bc2-37f1-409d-af6a-32ba0b730e6a.json",
            seller: "0xe6193b058bbd559e8e0df3a48202a3cdec852ab6",
            owner: "0x89DBad2C15A2fCEd932aEf71C2F798fD86B1349F".toLowerCase(),
            price: 10,
            image: "https://navy.online/marketplace/static/assets/captain/captain" + imageIndex + ".png",
            rarity: "Common",
            lastUpdated: 0,
            visuals: [],
            traits: [],
            contractAddress,
            collectionName,
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

        function newCollectionItem() {
            defaultCollectionItem.id = itemIdPrefix + nextId;
            defaultCollectionItem.tokenId = nextId;
            defaultCollectionItem.lastUpdated = nextTimeSeconds;
            defaultCollectionItem.visuals = generateCaptainVisuals();
            defaultCollectionItem.traits = generateCaptainTraits();
            defaultCollectionItem.image = "https://navy.online/marketplace/static/assets/captain/captain" + imageIndex + ".png";

            let price = SharedLibraryService.GetRandomIntInRange(1, 1000);
            let priceFloat = SharedLibraryService.GetRandomIntInRange(0, 1);
            let finalPrice = String(price);
            if (priceFloat == 1) {
                finalPrice += '.' + SharedLibraryService.GetRandomIntInRange(1, 99);
            }
            defaultCollectionItem.price = Number(finalPrice);

            return defaultCollectionItem;
        }

        // Today sells
        for (let i = 0; i < 20; i++) {
            const soldCollectionItem = newCollectionItem();
            soldCollectionItem.marketplaceState = MarketplaceState.SOLD;
            await new this.collectionItemModel(soldCollectionItem).save();

            const ownedCollectionItem = newCollectionItem();
            ownedCollectionItem.marketplaceState = MarketplaceState.NONE;
            await new this.collectionItemModel(ownedCollectionItem).save();

            imageIndex++;
            nextId++;
            nextTimeSeconds -= 60 * 30;
        }
        nextTimeSeconds = nowTimeSeconds;

        // 7d
        for (let i = 0; i < 20; i++) {
            const soldCollectionItem = newCollectionItem();
            soldCollectionItem.marketplaceState = MarketplaceState.SOLD;
            await new this.collectionItemModel(soldCollectionItem).save();

            const ownedCollectionItem = newCollectionItem();
            ownedCollectionItem.marketplaceState = MarketplaceState.NONE;
            await new this.collectionItemModel(ownedCollectionItem).save();

            imageIndex++;
            nextId++;
            nextTimeSeconds -= (60 * 60) * 10;
        }
        nextTimeSeconds = nowTimeSeconds;

        // 30d 
        for (let i = 0; i < 20; i++) {
            const soldCollectionItem = newCollectionItem();
            soldCollectionItem.marketplaceState = MarketplaceState.SOLD;
            await new this.collectionItemModel(soldCollectionItem).save();

            const ownedCollectionItem = newCollectionItem();
            ownedCollectionItem.marketplaceState = MarketplaceState.NONE;
            await new this.collectionItemModel(ownedCollectionItem).save();

            imageIndex++;
            nextId++;
            nextTimeSeconds -= daySeconds;
        }
    }

    private async loadFaq() {
        const faq = await this.faqModel.findOne();
        if (!faq) {
            FileUtils.LoadFixture('marketplace-service', '5_faq.json', async (fixtures: any) => {
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



}