// import { createCanvas, loadImage } from "canvas";
// import { IslandStats } from "../blockchain/blockchain.service";
// import { MoralisService } from "../moralis/moralis.service";
// import { v4 as uuidv4 } from 'uuid';
// import { Terrain } from "@app/shared-library/shared-library.main";

// export class NftIslandGenerator {
//     public static readonly SnowTerrainChance = 25;
//     public static readonly DarkTerrainChance = 15;

//     async generateFounderIsland(index: number, maxIndex: number, islandStats: IslandStats) {
//         const greenIslandImagePath = __dirname.split('dist')[0] + 'assets\\island\\green_island_img.png';
//         const snowIslandImagePath = __dirname.split('dist')[0] + 'assets\\island\\snow_island_img.png';
//         const darkIslandImagePath = __dirname.split('dist')[0] + 'assets\\island\\dark_island_img.png';

//         const canvas = createCanvas(190, 160);
//         const ctx = canvas.getContext('2d');

//         let terrainImagePath = greenIslandImagePath;
//         if (islandStats.terrain == Terrain.DARK) {
//             terrainImagePath = darkIslandImagePath;
//         } else if (islandStats.terrain == Terrain.SNOW) {
//             terrainImagePath = snowIslandImagePath;
//         }

//         const image = await loadImage(terrainImagePath);
//         ctx.drawImage(image, 0, 0, 190, 160);

//         const entityName = uuidv4();

//         const fileBuffer = canvas.toBuffer('image/png');
//         const uploadedImageFile = await MoralisService.UploadFile('nvy/' + entityName + '.png', fileBuffer.toString('base64')) as any;
//         const imagePathOnMoralis = uploadedImageFile.data[0].path;

//         const metadata = {
//             name: `Founders island (${index}/${maxIndex})`,
//             description: 'Founders island collection of Navy.online.',
//             image: imagePathOnMoralis,
//             attributes: [
//                 { level: islandStats.level },
//                 { rarity: islandStats.rarity },
//                 { terrain: islandStats.terrain },
//                 { miningRewardNVY: islandStats.miningRewardNVY },
//                 { shipAndCaptainFee: islandStats.shipAndCaptainFee },
//                 { maxMiners: islandStats.maxMiners },
//                 { minersFee: islandStats.minersFee },
//                 { x: islandStats.x },
//                 { y: islandStats.y }
//             ]
//         }

//         const uploadedMetadataFile = await MoralisService.UploadFile('nvy/' + entityName + '.json', Buffer.from(JSON.stringify(metadata)).toString('base64')) as any;
//         const metadataPathOnMoralis = uploadedMetadataFile.data[0].path;

//         return metadataPathOnMoralis as string;
//     }
// }