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

    private readonly backgroundVisualsMap = new Map<number, string>();
    private readonly bodyVisualsMap = new Map<number, string>();
    private readonly clothesVisualsMap = new Map<number, string>();
    private readonly faceVisualsMap = new Map<number, string>();
    private readonly accessoryVisualsMap = new Map<number, string>();
    private readonly headgearVisualsMap = new Map<number, string>();

    constructor(
        collection: Collection,
        private chainName: string,
        private chainId: string,
        private tokenSymbol: string,
        private captainTraitModel: Model<CaptainTraitDocument>,
        private captainSettingsModel: Model<CaptainSettingsDocument>,
        private collectionItemModel: Model<CollectionItemDocument>
    ) {
        super(NftType.CAPTAIN, collection);

        this.backgroundVisualsMap.set(0, 'Bg 1');
        this.backgroundVisualsMap.set(1, 'Bg 2');
        this.backgroundVisualsMap.set(2, 'Bg 3');
        this.backgroundVisualsMap.set(3, 'Bg 4');
        this.backgroundVisualsMap.set(4, 'Bg 5');
        this.backgroundVisualsMap.set(5, 'Bg 6');
        this.backgroundVisualsMap.set(6, 'Bg 7');
        this.backgroundVisualsMap.set(7, 'Bg 8');
        this.backgroundVisualsMap.set(8, 'Bg 9');
        this.backgroundVisualsMap.set(9, 'Bg 10');
        this.backgroundVisualsMap.set(10, 'Bg 11');
        this.backgroundVisualsMap.set(11, 'Bg 12');

        this.bodyVisualsMap.set(0, 'Sloth');

        this.clothesVisualsMap.set(0, 'Jacket 1');
        this.clothesVisualsMap.set(1, 'Jacket 2');
        this.clothesVisualsMap.set(2, 'Jacket 3');
        this.clothesVisualsMap.set(3, 'Jacket 4');
        this.clothesVisualsMap.set(4, 'Jacket 5');
        this.clothesVisualsMap.set(5, 'Jacket 6');

        this.faceVisualsMap.set(0, 'Upset');
        this.faceVisualsMap.set(1, 'Funny');
        this.faceVisualsMap.set(2, 'Mysterious');
        this.faceVisualsMap.set(3, 'Surprized');

        this.accessoryVisualsMap.set(0, 'Scarf');
        this.accessoryVisualsMap.set(1, 'Monocle');
        this.accessoryVisualsMap.set(2, 'Sunglasses');
        this.accessoryVisualsMap.set(3, 'Sigar');
        this.accessoryVisualsMap.set(4, 'Pirate band');
        this.accessoryVisualsMap.set(5, 'Pirate band');
        this.accessoryVisualsMap.set(6, 'Pirate band');

        this.headgearVisualsMap.set(1, 'Hair 1');
        this.headgearVisualsMap.set(2, 'Hair 2');
        this.headgearVisualsMap.set(3, 'Hair 3');
        this.headgearVisualsMap.set(4, 'Hair 4');
        this.headgearVisualsMap.set(5, 'Pirate hat');
        this.headgearVisualsMap.set(6, 'Crown');
        this.headgearVisualsMap.set(7, 'Bandana');
        this.headgearVisualsMap.set(8, 'Hat');
        this.headgearVisualsMap.set(9, 'Captain cap');
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
        newCollectionModel.visuals = this.generateVisuals(this.metadataObject);
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

    private generateVisuals(metadata: any) {
        const visuals = [];
        const attributes = metadata.attributes;

        visuals.push({ trait_type: 'Background', value: this.backgroundVisualsMap.get(attributes[4].background) });
        visuals.push({ trait_type: 'Body', value: this.bodyVisualsMap.get(attributes[5].body) });
        visuals.push({ trait_type: 'Clothes', value: this.clothesVisualsMap.get(attributes[6].clothes) });
        visuals.push({ trait_type: 'Face', value: this.faceVisualsMap.get(attributes[7].face) });

        if (attributes.length == 10) {
            visuals.push({ trait_type: 'Accessory', value: this.accessoryVisualsMap.get(attributes[8].accessory) });
            visuals.push({ trait_type: 'Headgear', value: this.headgearVisualsMap.get(attributes[9].headgear) });
        } else {
            visuals.push({ trait_type: 'Headgear', value: this.headgearVisualsMap.get(attributes[8].headgear) });
        }

        return visuals;
    }
}