import { EntityService } from "@app/shared-library/gprc/grpc.entity.service";
import { Collection } from "@app/shared-library/schemas/marketplace/schema.collection";
import { NftType, Rarity } from "@app/shared-library/shared-library.main";
import { NftSubPartDetails } from "@app/shared-library/workers/workers.marketplace";
import { Contract } from "ethers";
import { NftGenerator } from "./nft.generator";
import { lastValueFrom } from 'rxjs';

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

    constructor(collection: Collection, private entityService: EntityService) {
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
        console.log(captainTraits);

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

        this.metadata = JSON.stringify({
            name: `Captain (${index}/${maxIndex})`,
            description: 'Navy.online Gen1 captains collection',
            image: imagePathOnMoralis,
            attributes
        });
    }

    async mintNft(owner: string, contract: Contract, metadata: string) {
        await contract.grantCaptain(owner, metadata);
    }

    private generateTraits() {
        let traitsCount = 0;
        switch (this.rarity) {
            case Rarity.COMMON:
                traitsCount = 1;
            case Rarity.RARE:
            case Rarity.EPIC:
                traitsCount = 2;
            case Rarity.LEGENDARY:
                traitsCount = 3;
        }
    }

}