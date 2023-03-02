import { NftType } from "@app/shared-library/shared-library.main";
import { NftPartDetails, NftSubPartDetails } from "@app/shared-library/workers/workers.marketplace";
import { Contract } from "ethers";
import { NftGenerator } from "./nft.generator";

export interface CaptainStats {
    currentLevel: number;
    maxLevel: number;
    traits: string;
    rarity: number;
    staking: boolean,
    stakingRewardNVY: number;
    stakingStartedAt: number;
    stakingDurationSeconds: number;
}

export class NftCaptainGenerator extends NftGenerator {

    constructor(nftParts: NftPartDetails[]) {
        super(NftType.CAPTAIN, nftParts);
    }

    generateNftMetadata(index: number, maxIndex: number, imagePathOnMoralis: string, nftPartsToDraw: NftSubPartDetails[]) {
        const captainStats = {
            currentLevel: 0,
            maxLevel: 10,
            traits: '0',
            rarity: this.rarity,
            staking: false,
            stakingRewardNVY: 5,
            stakingStartedAt: 0,
            stakingDurationSeconds: 120,
        } as CaptainStats;

        this.metadata = JSON.stringify({
            name: `Founders captain (${index}/${maxIndex})`,
            description: 'Founders captain collection of Navy.online.',
            image: imagePathOnMoralis,
            attributes: [
                { stakingRewardNVY: captainStats.stakingRewardNVY },
                { stakingDurationSeconds: captainStats.stakingDurationSeconds },
                { traits: captainStats.traits },
                { currentLevel: captainStats.currentLevel },
                { maxLevel: captainStats.maxLevel },
                { rarity: captainStats.rarity },
                { background: nftPartsToDraw[0].index },
                { body: nftPartsToDraw[1].index },
                { clothes: nftPartsToDraw[2].index },
                { head: nftPartsToDraw[3].index },
                { accessory: nftPartsToDraw[4].index },
                { haircut_or_head: nftPartsToDraw[5].index }
            ]
        });
    }

    async mintNft(owner: string, nftContract: Contract, metadata: string) {
        await nftContract.grantCaptain(owner, metadata);
    }

}