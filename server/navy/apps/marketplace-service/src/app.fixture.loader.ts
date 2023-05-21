import { SharedLibraryService } from "@app/shared-library";
import { EthersConstants } from "@app/shared-library/ethers/ethers.constants";
import { CollectionDocument } from "@app/shared-library/schemas/marketplace/schema.collection";
import { CollectionItemDocument, MarketplaceState } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { FaqDocument } from "@app/shared-library/schemas/marketplace/schema.faq";
import { MintDocument } from "@app/shared-library/schemas/marketplace/schema.mint";
import { ProjectDocument } from "@app/shared-library/schemas/marketplace/schema.project";
import { FileUtils } from "@app/shared-library/shared-library.file.utils";
import { VenomConstants } from "@app/shared-library/venom/venom.constants";
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
            await this.collectionItemModel.deleteMany({
                chainName: SharedLibraryService.CRONOS_CHAIN_NAME,
                contractAddress: {
                    '$ne': EthersConstants.CaptainContractAddress
                }
            });

            await this.collectionItemModel.deleteMany({
                chainName: SharedLibraryService.VENOM_CHAIN_NAME,
                contractAddress: {
                    '$ne': VenomConstants.CaptainsCollectionContractAddress
                }
            });

            await this.loadTopSales('ships', EthersConstants.ShipContractAddress, SharedLibraryService.CRONOS_CHAIN_NAME);
            await this.loadTopSales('islands', EthersConstants.IslandContractAddress, SharedLibraryService.CRONOS_CHAIN_NAME);

            await this.loadTopSales('ships', VenomConstants.ShipsCollectionContractAddress, SharedLibraryService.VENOM_CHAIN_NAME);
            await this.loadTopSales('islands', VenomConstants.IslandsCollectionContractAddress, SharedLibraryService.VENOM_CHAIN_NAME);
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
                    const collections = [
                        new this.collectionModel(),
                        new this.collectionModel(),
                        new this.collectionModel(),
                        new this.collectionModel()
                    ];

                    for (let i = 0; i < fixtures.length; i++) {
                        collections[i].name = fixtures[i].name;
                        collections[i].description = fixtures[i].description;
                        collections[i].chainName = fixtures[i].chainName;
                        collections[i].contractAddress = fixtures[i].contractAddress.toLowerCase();
                        collections[i].collectionSize = fixtures[i].collectionSize;
                        collections[i].collectionItemsLeft = fixtures[i].collectionItemsLeft;
                        collections[i].preview = fixtures[i].preview;
                    }

                    FileUtils.LoadFixture('marketplace-service', '3_mints.json', async (fixtures: any) => {
                        for (let i = 0; i < fixtures.length; i++) {
                            const mint = new this.mintModel();

                            if (fixtures[i].mintingDetails.collectionContractAddress) {
                                fixtures[i].mintingDetails.collectionContractAddress.toLowerCase();
                            } else {
                                fixtures[i].mintingDetails.saleContractAddress.toLowerCase();
                                fixtures[i].mintingDetails.tokenContractAddress.toLowerCase();
                            }

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
        }
    }

    private async loadTopSales(collectionName: string, contractAddress: string, chainName: string) {
        const coinSymbol = chainName == SharedLibraryService.VENOM_CHAIN_NAME ?
            SharedLibraryService.VENOM_TOKEN_SYMBOL : SharedLibraryService.CRONOS_TOKEN_SYMBOL;
        const chainId = chainName == SharedLibraryService.VENOM_CHAIN_NAME ?
            SharedLibraryService.VENOM_CHAIN_ID : SharedLibraryService.CRONOS_CHAIN_ID;
        const owner = chainName == SharedLibraryService.VENOM_CHAIN_NAME ?
            '0:d3d74c409a8961c335d2111e1f64c7daa0dd40835aab5e0b500de91b4be8083e' : '0x89dbad2c15a2fced932aef71c2f798fd86b1349c';
        const seller = chainName == SharedLibraryService.VENOM_CHAIN_NAME ?
            '0:47ff382c680403d2f1982f2580edc847c31feb0702ab07837772d29c88401f0f' : '0xe6193b058bbd559e8e0df3a48202a3cdec852ab6';

        const nowTimeSeconds = Number(Number(Date.now() / 1000).toFixed(0));
        const daySeconds = 24 * 60 * 60;
        const itemIdPrefix = contractAddress + '_';
        let nextId = 54;
        let nextTimeSeconds = nowTimeSeconds;
        let imageIndex = 1;

        const defaultCollectionItem = {
            needUpdate: false,
            id: itemIdPrefix,
            tokenId: 0,
            tokenUri: "https://ipfs.moralis.io:2053/ipfs/QmQmRiVEaAbBnF7rnGNfaTMya2UH7NyRu2HCjc8HvN88R5/nvy/e1b50bc2-37f1-409d-af6a-32ba0b730e6a.json",
            seller,
            owner,
            price: 10,
            image: "https://navy.online/api/marketplace/static/assets/captain/captain" + imageIndex + ".png",
            rarity: "Common",
            lastUpdated: 0,
            visuals: [],
            traits: [],
            contractAddress,
            collectionName,
            marketplaceState: 'Sold',
            coinSymbol,
            chainName,
            chainId
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
                    description: 'Bonus 1',
                    shipStatsAffected: ['Everything is better']
                }
            ]
        }

        function newCollectionItem() {
            defaultCollectionItem.id = itemIdPrefix + nextId;
            defaultCollectionItem.tokenId = nextId;
            defaultCollectionItem.lastUpdated = nextTimeSeconds;
            defaultCollectionItem.visuals = generateCaptainVisuals();
            defaultCollectionItem.traits = generateCaptainTraits();

            if (collectionName == 'captains') {
                defaultCollectionItem.image = "https://navy.online/api/marketplace/static/assets/captain/captain" + imageIndex + ".png";
            }
            if (collectionName == 'ships') {
                defaultCollectionItem.image = "https://navy.online/api/marketplace/static/assets/ship/ship" + imageIndex + ".png";

                if (imageIndex == 1) {
                    defaultCollectionItem.rarity = 'Epic';
                }
                if (imageIndex == 2) {
                    defaultCollectionItem.rarity = 'Rare';
                }
                if (imageIndex == 3) {
                    defaultCollectionItem.rarity = 'Common';
                }
            }
            if (collectionName == 'islands') {
                defaultCollectionItem.image = "https://navy.online/api/marketplace/static/assets/island/island" + imageIndex + ".png";

                if (imageIndex == 1) {
                    defaultCollectionItem.rarity = 'Legendary';
                } else if (imageIndex == 2) {
                    defaultCollectionItem.rarity = 'Epic';
                } else if (imageIndex == 3 || imageIndex == 6) {
                    defaultCollectionItem.rarity = 'Rare';
                } else if (imageIndex == 1) {
                    defaultCollectionItem.rarity = 'Common';
                }
            }

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
        for (let i = 0; i < 10; i++) {
            const soldCollectionItem = newCollectionItem();
            soldCollectionItem.marketplaceState = MarketplaceState.SOLD;
            await new this.collectionItemModel(soldCollectionItem).save();

            const ownedCollectionItem = newCollectionItem();
            ownedCollectionItem.marketplaceState = MarketplaceState.NONE;
            await new this.collectionItemModel(ownedCollectionItem).save();

            imageIndex++;
            if (imageIndex == 4 && collectionName == 'ships' || imageIndex == 7 && collectionName == 'islands') {
                imageIndex = 1;
            }
            nextId++;
            nextTimeSeconds -= 60 * 30;
        }
        nextTimeSeconds = nowTimeSeconds;

        // 7d
        for (let i = 0; i < 10; i++) {
            const soldCollectionItem = newCollectionItem();
            soldCollectionItem.marketplaceState = MarketplaceState.SOLD;
            await new this.collectionItemModel(soldCollectionItem).save();

            const ownedCollectionItem = newCollectionItem();
            ownedCollectionItem.marketplaceState = MarketplaceState.NONE;
            await new this.collectionItemModel(ownedCollectionItem).save();

            imageIndex++;
            if (imageIndex == 4 && collectionName == 'ships' || imageIndex == 7 && collectionName == 'islands') {
                imageIndex = 1;
            }
            nextId++;
            nextTimeSeconds -= (60 * 60) * 10;
        }
        nextTimeSeconds = nowTimeSeconds;

        // 30d 
        for (let i = 0; i < 10; i++) {
            const soldCollectionItem = newCollectionItem();
            soldCollectionItem.marketplaceState = MarketplaceState.SOLD;
            await new this.collectionItemModel(soldCollectionItem).save();

            const ownedCollectionItem = newCollectionItem();
            ownedCollectionItem.marketplaceState = MarketplaceState.NONE;
            await new this.collectionItemModel(ownedCollectionItem).save();

            imageIndex++;
            if (imageIndex == 4 && collectionName == 'ships' || imageIndex == 7 && collectionName == 'islands') {
                imageIndex = 1;
            }
            nextId++;
            nextTimeSeconds -= daySeconds;
        }
    }

    private async loadFaq() {
        const faq = await this.faqModel.findOne();
        if (!faq) {
            FileUtils.LoadFixture('marketplace-service', '4_faq.json', async (fixtures: any) => {
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