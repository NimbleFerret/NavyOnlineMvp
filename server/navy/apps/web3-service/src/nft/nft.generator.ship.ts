// import { SharedLibraryService } from "@app/shared-library";
// import { ShipEntity } from "@app/shared-library/entities/entity.ship";
// import { createCanvas, loadImage } from "canvas";
// import { MoralisService } from "../moralis/moralis.service";
// import { v4 as uuidv4 } from 'uuid';

// export class NftShipGenerator {

//     private readonly AnchorChance = 5;
//     private readonly OneWindowChance = 35;
//     private readonly TwoWindowChance = 15;

//     async generateFounderShip(index: number, maxIndex: number, shipStats: ShipEntity) {
//         const middleShipImagePath = __dirname.split('dist')[0] + 'assets\\middle_ship.png';
//         const threeCannonsImagePath = __dirname.split('dist')[0] + 'assets\\cannons3.png';
//         const fourCannonsImagePath = __dirname.split('dist')[0] + 'assets\\cannons4.png';
//         const flagImagePath = __dirname.split('dist')[0] + 'assets\\flag.png';
//         const sailImagePath = __dirname.split('dist')[0] + 'assets\\sail.png';
//         const golderAnchorImagePath = __dirname.split('dist')[0] + 'assets\\golden_anchor.png';
//         const mastImagePath = __dirname.split('dist')[0] + 'assets\\mast.png';
//         const oneWindowImagePath = __dirname.split('dist')[0] + 'assets\\one_window.png';
//         const twoWindowImagePath = __dirname.split('dist')[0] + 'assets\\two_windows.png';
//         const wheelImagePath = __dirname.split('dist')[0] + 'assets\\wheel.png';

//         const canvas = createCanvas(455, 455);
//         const ctx = canvas.getContext('2d');

//         const shipImage = await loadImage(middleShipImagePath);
//         const mastImage = await loadImage(mastImagePath);
//         const flagImage = await loadImage(flagImagePath);
//         const sailImage = await loadImage(sailImagePath);
//         const wheelImage = await loadImage(wheelImagePath);

//         const anchorRnd = SharedLibraryService.GetRandomIntInRange(1, 100);
//         const oneWindowRnd = SharedLibraryService.GetRandomIntInRange(1, 100);
//         const twoWindowRnd = SharedLibraryService.GetRandomIntInRange(1, 100);

//         ctx.drawImage(shipImage, 0, 0, 455, 455);

//         if (shipStats.cannons == 4) {
//             const cannons = await loadImage(fourCannonsImagePath);
//             ctx.drawImage(cannons, 0, 0, 455, 455);
//         } else {
//             const cannons = await loadImage(threeCannonsImagePath);
//             ctx.drawImage(cannons, 0, 0, 455, 455);
//         }

//         ctx.drawImage(mastImage, 0, 0, 455, 455);
//         ctx.drawImage(sailImage, 0, 0, 455, 455);
//         ctx.drawImage(flagImage, 0, 0, 455, 455);
//         ctx.drawImage(wheelImage, 0, 0, 455, 455);

//         let anchorType = 0;
//         if (100 - this.AnchorChance < anchorRnd) {
//             const anchor = await loadImage(golderAnchorImagePath);
//             ctx.drawImage(anchor, 0, 0, 455, 455);
//             anchorType = 1;
//         }

//         let windows = 0;
//         if (100 - this.OneWindowChance < oneWindowRnd) {
//             const anchor = await loadImage(oneWindowImagePath);
//             ctx.drawImage(anchor, 0, 0, 455, 455);
//             windows = 1;
//         } else if (100 - this.TwoWindowChance < twoWindowRnd) {
//             const anchor = await loadImage(twoWindowImagePath);
//             ctx.drawImage(anchor, 0, 0, 455, 455);
//             windows = 2;
//         }

//         const entityName = uuidv4();

//         const fileBuffer = canvas.toBuffer('image/png');
//         const uploadedImageFile = await MoralisService.UploadFile('nvy/' + entityName + '.png', fileBuffer.toString('base64')) as any;
//         const imagePathOnMoralis = uploadedImageFile.data[0].path;

//         const metadata = {
//             name: `Founders middle ship (${index}/${maxIndex})`,
//             description: 'Founders ship collection of Navy.online.',
//             image: imagePathOnMoralis,
//             attributes: [
//                 { hull: shipStats.hull },
//                 { armor: shipStats.armor },
//                 { maxSpeed: shipStats.maxSpeed },
//                 { accelerationStep: shipStats.accelerationStep },
//                 { accelerationDelay: shipStats.accelerationDelay },
//                 { rotationDelay: shipStats.rotationDelay },
//                 { fireDelay: shipStats.fireDelay },
//                 { cannons: shipStats.cannons },
//                 { cannonsRange: shipStats.cannonsRange },
//                 { cannonsDamage: shipStats.cannonsDamage },
//                 { traits: shipStats.traits },
//                 { level: shipStats.level },
//                 { rarity: shipStats.rarity },
//                 { size: shipStats.size },
//                 { currentIntegrity: shipStats.maxIntegrity },
//                 { maxIntegrity: shipStats.maxIntegrity },
//                 { windows },
//                 { anchor: anchorType }
//             ]
//         }

//         const uploadedMetadataFile = await MoralisService.UploadFile('nvy/' + entityName + '.json', Buffer.from(JSON.stringify(metadata)).toString('base64')) as any;
//         const metadataPathOnMoralis = uploadedMetadataFile.data[0].path;

//         return metadataPathOnMoralis as string;
//     }

// }