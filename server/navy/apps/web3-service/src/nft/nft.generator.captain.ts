// import { CaptainStats } from "../blockchain/blockchain.service";
// import { NftGenerator, NftPartDetails, NftSubPartDetails } from "./nft.generator";
// import { NftType } from "@app/shared-library/shared-library.main";

// export class NftCaptainGenerator extends NftGenerator {

//     constructor(nftParts: NftPartDetails[]) {
//         super(NftType.CAPTAIN, nftParts);
//     }

//     generateMetadata(index: number, maxIndex: number, imagePathOnMoralis: string, nftPartsToDraw: NftSubPartDetails[]) {
//         const captainStats = {
//             currentLevel: 0,
//             maxLevel: 10,
//             traits: '0',
//             rarity: this.rarity,
//             staking: false,
//             stakingRewardNVY: 5,
//             stakingStartedAt: 0,
//             stakingDurationSeconds: 120,
//         } as CaptainStats;

//         this.metadata = JSON.stringify({
//             name: `Founders captain (${index}/${maxIndex})`,
//             description: 'Founders captain collection of Navy.online.',
//             image: imagePathOnMoralis,
//             attributes: [
//                 { stakingRewardNVY: captainStats.stakingRewardNVY },
//                 { stakingDurationSeconds: captainStats.stakingDurationSeconds },
//                 { traits: captainStats.traits },
//                 { currentLevel: captainStats.currentLevel },
//                 { maxLevel: captainStats.maxLevel },
//                 { rarity: captainStats.rarity },
//                 { background: nftPartsToDraw[0].index },
//                 { body: nftPartsToDraw[1].index },
//                 { clothes: nftPartsToDraw[2].index },
//                 { head: nftPartsToDraw[3].index },
//                 { accessory: nftPartsToDraw[4].index },
//                 { haircut_or_head: nftPartsToDraw[5].index }
//             ]
//         });
//     }

// }