import {
    GenerateCaptainTraitsRequest,
    GetRandomCaptainTraitRequest,
    GetRandomCaptainTraitResponse
} from "@app/shared-library/gprc/grpc.entity.service";
import { Collection } from "@app/shared-library/schemas/marketplace/schema.collection";
import { NftType, Rarity } from "@app/shared-library/shared-library.main";
import { NftSubPartDetails } from "@app/shared-library/workers/workers.marketplace";
import { NftGenerator } from "./nft.generator";
import { CollectionItemDocument, MarketplaceState } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { Model } from "mongoose";
import { Logger } from "@nestjs/common";
import { SharedLibraryService } from "@app/shared-library";
import { CaptainSettingsDocument } from "@app/shared-library/schemas/entity/schema.captain.settings";
import { CaptainTraitDocument } from "@app/shared-library/schemas/entity/schema.captain.trait";
import { BlockchainBaseProcessor } from "@app/shared-library/blockchain/blockchain.base.provider";

export interface CaptainStats {
    currentLevel: number;
    maxLevel: number;
    traits: any;
    rarity: number;
}

export abstract class NftGeneratorCaptainBase extends NftGenerator {

    private metadataObject: any;

    private traitsCount = 0;
    private commonCaptainTraits = 0;
    private rareCaptainTraits = 0;
    private epicCaptainTraits = 0;
    private legendaryCaptainTraits = 0;

    private static readonly BackgroundVisualsMap = new Map<number, string>();
    private static readonly BodyVisualsMap = new Map<number, string>();
    private static readonly ClothesVisualsMap = new Map<number, string>();
    private static readonly FaceVisualsMap = new Map<number, string>();
    private static readonly Accessory1VisualsMap = new Map<number, string>();
    private static readonly Accessory2VisualsMap = new Map<number, string>();
    private static readonly HeadgearVisualsMap = new Map<number, string>();
    private static readonly BeardVisualsMap = new Map<number, string>();

    constructor(
        collection: Collection,
        chainName: string,
        private chainId: string,
        private tokenSymbol: string,
        private captainTraitModel: Model<CaptainTraitDocument>,
        private captainSettingsModel: Model<CaptainSettingsDocument>,
        private collectionItemModel: Model<CollectionItemDocument>
    ) {
        super(chainName, NftType.CAPTAIN, collection);

        NftGeneratorCaptainBase.BackgroundVisualsMap.set(0, 'Bg 1');
        NftGeneratorCaptainBase.BackgroundVisualsMap.set(1, 'Bg 2');
        NftGeneratorCaptainBase.BackgroundVisualsMap.set(2, 'Bg 3');
        NftGeneratorCaptainBase.BackgroundVisualsMap.set(3, 'Bg 4');
        NftGeneratorCaptainBase.BackgroundVisualsMap.set(4, 'Bg 5');
        NftGeneratorCaptainBase.BackgroundVisualsMap.set(5, 'Bg 6');
        NftGeneratorCaptainBase.BackgroundVisualsMap.set(6, 'Bg 7');
        NftGeneratorCaptainBase.BackgroundVisualsMap.set(7, 'Bg 8');
        NftGeneratorCaptainBase.BackgroundVisualsMap.set(8, 'Bg 9');
        NftGeneratorCaptainBase.BackgroundVisualsMap.set(9, 'Bg 10');
        NftGeneratorCaptainBase.BackgroundVisualsMap.set(10, 'Bg 11');
        NftGeneratorCaptainBase.BackgroundVisualsMap.set(11, 'Bg 12');

        if (chainName == SharedLibraryService.CRONOS_CHAIN_NAME) {
            NftGeneratorCaptainBase.BodyVisualsMap.set(0, 'Sloth');

            NftGeneratorCaptainBase.ClothesVisualsMap.set(0, 'Jacket 1');
            NftGeneratorCaptainBase.ClothesVisualsMap.set(1, 'Jacket 2');
            NftGeneratorCaptainBase.ClothesVisualsMap.set(2, 'Jacket 3');
            NftGeneratorCaptainBase.ClothesVisualsMap.set(3, 'Jacket 4');
            NftGeneratorCaptainBase.ClothesVisualsMap.set(4, 'Jacket 5');
            NftGeneratorCaptainBase.ClothesVisualsMap.set(5, 'Jacket 6');

            NftGeneratorCaptainBase.FaceVisualsMap.set(0, 'Upset');
            NftGeneratorCaptainBase.FaceVisualsMap.set(1, 'Funny');
            NftGeneratorCaptainBase.FaceVisualsMap.set(2, 'Mysterious');
            NftGeneratorCaptainBase.FaceVisualsMap.set(3, 'Surprized');

            NftGeneratorCaptainBase.Accessory1VisualsMap.set(0, 'Scarf');
            NftGeneratorCaptainBase.Accessory1VisualsMap.set(1, 'Monocle');
            NftGeneratorCaptainBase.Accessory1VisualsMap.set(2, 'Sunglasses');
            NftGeneratorCaptainBase.Accessory1VisualsMap.set(3, 'Sigar');
            NftGeneratorCaptainBase.Accessory1VisualsMap.set(4, 'Pirate band');
            NftGeneratorCaptainBase.Accessory1VisualsMap.set(5, 'Pirate band');
            NftGeneratorCaptainBase.Accessory1VisualsMap.set(6, 'Pirate band');

            NftGeneratorCaptainBase.HeadgearVisualsMap.set(1, 'Hair 1');
            NftGeneratorCaptainBase.HeadgearVisualsMap.set(2, 'Hair 2');
            NftGeneratorCaptainBase.HeadgearVisualsMap.set(3, 'Hair 3');
            NftGeneratorCaptainBase.HeadgearVisualsMap.set(4, 'Hair 4');
            NftGeneratorCaptainBase.HeadgearVisualsMap.set(5, 'Pirate hat');
            NftGeneratorCaptainBase.HeadgearVisualsMap.set(6, 'Crown');
            NftGeneratorCaptainBase.HeadgearVisualsMap.set(7, 'Bandana');
            NftGeneratorCaptainBase.HeadgearVisualsMap.set(8, 'Hat');
            NftGeneratorCaptainBase.HeadgearVisualsMap.set(9, 'Captain cap');
        } else if (chainName == SharedLibraryService.VENOM_CHAIN_NAME) {
            NftGeneratorCaptainBase.ClothesVisualsMap.set(0, 'Jacket 1');
            NftGeneratorCaptainBase.ClothesVisualsMap.set(1, 'Jacket 2');
            NftGeneratorCaptainBase.ClothesVisualsMap.set(2, 'Jacket 3');
            NftGeneratorCaptainBase.ClothesVisualsMap.set(3, 'Jacket 4');
            NftGeneratorCaptainBase.ClothesVisualsMap.set(4, 'Jacket 5');

            NftGeneratorCaptainBase.Accessory1VisualsMap.set(0, 'Scar');
            NftGeneratorCaptainBase.Accessory1VisualsMap.set(1, 'Moustache');

            NftGeneratorCaptainBase.Accessory2VisualsMap.set(0, 'Monocle 1');
            NftGeneratorCaptainBase.Accessory2VisualsMap.set(1, 'Pirate band');
            NftGeneratorCaptainBase.Accessory2VisualsMap.set(2, 'Bond');
            NftGeneratorCaptainBase.Accessory2VisualsMap.set(3, 'Monocle 2');

            NftGeneratorCaptainBase.BeardVisualsMap.set(0, 'Beard 1');
            NftGeneratorCaptainBase.BeardVisualsMap.set(1, 'Beard 2');

            NftGeneratorCaptainBase.FaceVisualsMap.set(0, 'Normal');

            NftGeneratorCaptainBase.HeadgearVisualsMap.set(1, 'Hat 1');
            NftGeneratorCaptainBase.HeadgearVisualsMap.set(2, 'Hat 2');
            NftGeneratorCaptainBase.HeadgearVisualsMap.set(3, 'Hat 3');
            NftGeneratorCaptainBase.HeadgearVisualsMap.set(4, 'Hat 4');
            NftGeneratorCaptainBase.HeadgearVisualsMap.set(5, 'Hat 5');
        }
    }

    // -------------------------------
    // Abstract functions
    // -------------------------------

    abstract mintNft(owner: string, metadataUrl: string);

    async init() {
        const captainSettings = await this.captainSettingsModel.findOne();
        this.traitsCount = await this.captainTraitModel.count();
        this.commonCaptainTraits = captainSettings.commonCaptainDefaultTraits;
        this.rareCaptainTraits = captainSettings.rareCaptainDefaultTraits;
        this.epicCaptainTraits = captainSettings.epicCaptainDefaultTraits;
        this.legendaryCaptainTraits = captainSettings.legendaryCaptainDefaultTraits;

        this.initiateVisualParts();
    }

    async generateNftMetadata(index: number, maxIndex: number, imagePathOnMoralis: string, nftPartsToDraw: NftSubPartDetails[]) {
        this.currentIndex = index;

        const captainStats = {
            currentLevel: 0,
            maxLevel: 10,
            rarity: this.rarity,
        } as CaptainStats;

        const captainTraits = await this.generateCaptainTraits({ rarity: this.rarity });

        const attributes: any[] = [
            { traits: captainTraits.traits },
            { currentLevel: captainStats.currentLevel },
            { maxLevel: captainStats.maxLevel },
            { rarity: captainStats.rarity },
        ]

        // TODO FIX this and visuals copy/paste code
        if (this.chainName == SharedLibraryService.CRONOS_CHAIN_NAME) {
            attributes.push({ background: nftPartsToDraw[0].index });
            attributes.push({ body: nftPartsToDraw[1].index });
            attributes.push({ clothes: nftPartsToDraw[2].index });
            attributes.push({ face: nftPartsToDraw[3].index });

            if (nftPartsToDraw.length == 5) {
                attributes.push({ headgear: nftPartsToDraw[4].index });
            } else {
                attributes.push({ accessory: nftPartsToDraw[4].index });
                attributes.push({ headgear: nftPartsToDraw[5].index });
            }
        } else if (this.chainName == SharedLibraryService.VENOM_CHAIN_NAME) {
            attributes.push({ background: nftPartsToDraw[0].index });
            attributes.push({ clothes: nftPartsToDraw[1].index });
            attributes.push({ face: nftPartsToDraw[2].index });
            attributes.push({ accessory1: nftPartsToDraw[3].index });
            attributes.push({ accessory2: nftPartsToDraw[4].index });
            attributes.push({ hat: nftPartsToDraw[5].index });
        }

        this.metadataObject = {
            name: `Captain (${index}/${maxIndex})`,
            index,
            description: 'Navy metaverse Gen1 captains collection',
            image: imagePathOnMoralis,
            attributes
        };
        this.metadata = JSON.stringify(this.metadataObject);
    }

    async saveCollectionItem(owner: string, nftContractAddress: string, metadataUrl: string) {
        let rarity = 'Common';
        switch (this.metadataObject.attributes[3].rarity) {
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

        const newCollectionModel = new this.collectionItemModel;
        newCollectionModel.id = nftContractAddress + '_' + this.metadataObject.index;
        newCollectionModel.tokenId = this.metadataObject.index;
        newCollectionModel.tokenUri = metadataUrl;
        newCollectionModel.image = this.metadataObject.image;
        newCollectionModel.owner = owner.toLowerCase();
        newCollectionModel.traits = this.metadataObject.attributes[0].traits;
        newCollectionModel.visuals = NftGeneratorCaptainBase.GenerateVisuals(this.chainName, this.metadataObject);
        newCollectionModel.rarity = rarity;
        newCollectionModel.contractAddress = nftContractAddress;
        newCollectionModel.collectionName = BlockchainBaseProcessor.NftTypeToString(NftType.CAPTAIN);
        newCollectionModel.lastUpdated = Number((Date.now() / 1000).toFixed(0));
        newCollectionModel.chainId = this.chainId;
        newCollectionModel.chainName = this.chainName;
        newCollectionModel.tokenSymbol = this.tokenSymbol;
        newCollectionModel.marketplaceState = MarketplaceState.NONE;

        await newCollectionModel.save();

        Logger.log(`Captain ${newCollectionModel.tokenId} minted!`);
    }

    // -------------------------------

    private async getRandomCaptainTrait(request: GetRandomCaptainTraitRequest) {
        const response = {
            traits: []
        } as GetRandomCaptainTraitResponse;
        const excludeIndexes: number[] = [];
        if (request.excludeIds && request.excludeIds.length > 0) {
            excludeIndexes.push(...request.excludeIds);
        }

        for (let i = 0; i < request.count; i++) {
            const index = SharedLibraryService.GetRandomIntInRangeExcept(1, this.traitsCount, excludeIndexes);
            const trait = await this.captainTraitModel.findOne({ index });
            response.traits.push({
                index: trait.index,
                description: trait.description,
                bonusType: trait.bonusType,
                shipStatsAffected: trait.shipStatsAffected
            });
            excludeIndexes.push(trait.index);
        }

        return response;
    }

    private async generateCaptainTraits(request: GenerateCaptainTraitsRequest) {
        let traits = this.commonCaptainTraits;
        switch (request.rarity) {
            case Rarity.LEGENDARY:
                traits = this.legendaryCaptainTraits;
                break;
            case Rarity.EPIC:
                traits = this.epicCaptainTraits;
                break;
            case Rarity.RARE:
                traits = this.rareCaptainTraits;
                break;
        }
        return await this.getRandomCaptainTrait({
            count: traits,
            excludeIds: []
        });
    }

    public static GenerateVisuals(chainName: string, metadata: any) {
        const visuals = [];
        const attributes = metadata.attributes;

        if (chainName == SharedLibraryService.CRONOS_CHAIN_NAME) {
            visuals.push({ trait_type: 'Background', value: NftGeneratorCaptainBase.BackgroundVisualsMap.get(attributes[4].background) });
            visuals.push({ trait_type: 'Body', value: NftGeneratorCaptainBase.BodyVisualsMap.get(attributes[5].body) });
            visuals.push({ trait_type: 'Clothes', value: NftGeneratorCaptainBase.ClothesVisualsMap.get(attributes[6].clothes) });
            visuals.push({ trait_type: 'Face', value: NftGeneratorCaptainBase.FaceVisualsMap.get(attributes[7].face) });

            if (attributes.length == 10) {
                visuals.push({ trait_type: 'Accessory', value: NftGeneratorCaptainBase.Accessory1VisualsMap.get(attributes[8].accessory) });
                visuals.push({ trait_type: 'Headgear', value: NftGeneratorCaptainBase.HeadgearVisualsMap.get(attributes[9].headgear) });
            } else {
                visuals.push({ trait_type: 'Headgear', value: NftGeneratorCaptainBase.HeadgearVisualsMap.get(attributes[8].headgear) });
            }
        } else if (chainName == SharedLibraryService.VENOM_CHAIN_NAME) {
            visuals.push({ trait_type: 'Background', value: NftGeneratorCaptainBase.BackgroundVisualsMap.get(attributes[4].background) });
            visuals.push({ trait_type: 'Clothes', value: NftGeneratorCaptainBase.ClothesVisualsMap.get(attributes[5].clothes) });
            visuals.push({ trait_type: 'Face', value: NftGeneratorCaptainBase.FaceVisualsMap.get(attributes[6].face) });
            visuals.push({ trait_type: 'Accessory 1', value: NftGeneratorCaptainBase.Accessory1VisualsMap.get(attributes[7].accessory) });
            visuals.push({ trait_type: 'Accessory 2', value: NftGeneratorCaptainBase.Accessory2VisualsMap.get(attributes[8].accessory) });
            visuals.push({ trait_type: 'Hat', value: NftGeneratorCaptainBase.HeadgearVisualsMap.get(attributes[9].accessory) });
        }

        return visuals;
    }
}