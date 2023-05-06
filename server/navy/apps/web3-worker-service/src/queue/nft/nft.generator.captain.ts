import { EntityService } from "@app/shared-library/gprc/grpc.entity.service";
import { Collection } from "@app/shared-library/schemas/marketplace/schema.collection";
import { NftType, Rarity } from "@app/shared-library/shared-library.main";
import { NftSubPartDetails } from "@app/shared-library/workers/workers.marketplace";
import { Contract } from "ethers";
import { NftGenerator } from "./nft.generator";
import { lastValueFrom } from 'rxjs';
import { CollectionItemDocument, MarketplaceState } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { Model } from "mongoose";

export interface CaptainStats {
    currentLevel: number;
    maxLevel: number;
    traits: any;
    rarity: number;
    // staking: boolean,
    // stakingRewardNVY: number;
    // stakingStartedAt: number;
    // stakingDurationSeconds: number;
}

export class NftCaptainGenerator extends NftGenerator {

    private metadataObject: any;

    constructor(
        collection: Collection,
        private entityService: EntityService,
        private collectionItemModel: Model<CollectionItemDocument>
    ) {
        super(NftType.CAPTAIN, collection);
    }

    async generateNftMetadata(index: number, maxIndex: number, imagePathOnMoralis: string, nftPartsToDraw: NftSubPartDetails[]) {
        const captainStats = {
            currentLevel: 0,
            maxLevel: 10,
            rarity: this.rarity,
            // staking: false,
            // stakingRewardNVY: 5,
            // stakingStartedAt: 0,
            // stakingDurationSeconds: 120,
        } as CaptainStats;

        const captainTraits = await lastValueFrom(this.entityService.GenerateCaptainTraits({ rarity: this.rarity }));

        const attributes: any[] = [
            // { stakingRewardNVY: captainStats.stakingRewardNVY },
            // { stakingDurationSeconds: captainStats.stakingDurationSeconds },
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
            name: `Captain (${maxIndex - index}/${maxIndex})`,
            index: maxIndex - index,
            description: 'Navy.online Gen1 captains collection',
            image: imagePathOnMoralis,
            attributes
        };
        console.log(this.metadataObject);
        this.metadata = JSON.stringify(this.metadataObject);
    }

    async mintNft(owner: string, contract: Contract, metadataUrl: string) {
        await contract.grantCaptain(owner, metadataUrl);

        let rarity = 'Common';
        switch (this.metadataObject.attributes.rarity) {
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
        newCollectionModel.id = contract.address + '_' + this.metadataObject.index;
        newCollectionModel.tokenId = this.metadataObject.index;
        newCollectionModel.tokenUri = metadataUrl;
        newCollectionModel.image = this.metadataObject.image;
        newCollectionModel.owner = owner;
        newCollectionModel.traits = this.metadataObject.attributes[0].traits;
        newCollectionModel.rarity = rarity;
        newCollectionModel.contractAddress = contract.address;
        newCollectionModel.collectionName = 'captains';
        newCollectionModel.chainId = '338';
        newCollectionModel.marketplaceState = MarketplaceState.NONE;
        await newCollectionModel.save();
    }

}