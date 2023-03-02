// import { SelectPercentageOptions, SharedLibraryService } from "@app/shared-library";
// import { NftType, Rarity } from "@app/shared-library/shared-library.main";
// import { createCanvas, loadImage } from "canvas";
// import { v4 as uuidv4 } from 'uuid';
// import { MoralisService } from "../moralis/moralis.service";



// export abstract class NftGenerator {

//     metadata: string;
//     rarity: Rarity;
//     private nftPartsToDraw: NftSubPartDetails[] = [];
//     private nftTypeName: string;

//     constructor(public nftType: NftType, private nftPartDetails: NftPartDetails[]) {
//         switch (nftType) {
//             case NftType.CAPTAIN:
//                 this.nftTypeName = 'captain';
//                 break;
//             case NftType.SHIP:
//                 this.nftTypeName = 'ship';
//                 break;
//             case NftType.ISLAND:
//                 this.nftTypeName = 'island';
//                 break;
//         }
//         this.initiateNftPartsImagePath();
//     }

//     public async generateNft(index: number, maxIndex: number) {
//         const canvas = createCanvas(72, 72);
//         const ctx = canvas.getContext('2d');

//         this.rarity = SharedLibraryService.GenerateRarity();

//         // Sort subparts by rarity
//         this.nftPartDetails.forEach(nftPart => {
//             nftPart.subParts = nftPart.subParts.map(subPart => {
//                 if (this.rarity >= subPart.rarity) {
//                     return subPart;
//                 }
//             }).filter(f => f).sort(function (a, b) { return b.rarity - a.rarity });
//         });

//         for (const nftPart of this.nftPartDetails) {
//             const selectPercentageOptions: SelectPercentageOptions<NftSubPartDetails>[] = []

//             // Select subpart within rarity by random chance
//             for (let index = 0; index < nftPart.subParts.length; index++) {
//                 const value = nftPart.subParts[index];
//                 const percentage = value.chance;
//                 if (index == 0 || selectPercentageOptions[0].value.rarity == nftPart.subParts[index].rarity) {
//                     selectPercentageOptions.push({ value, percentage });
//                 }
//             }
//             const nftPartToDraw = SharedLibraryService.SelectItemByPercentage(selectPercentageOptions);
//             this.nftPartsToDraw.push(nftPartToDraw);

//             // Draw each part
//             const image = await loadImage(nftPartToDraw.filePath);
//             ctx.drawImage(image, 0, 0, 72, 72);
//         }

//         // Upload image to the ipfs
//         const entityName = uuidv4();
//         const fileBuffer = canvas.toBuffer('image/png');
//         const uploadedImageFile = await MoralisService.UploadFile('nvy/' + entityName + '.png', fileBuffer.toString('base64')) as any;
//         const imagePathOnMoralis = uploadedImageFile.toJSON()[0].path;

//         this.generateMetadata(index, maxIndex, imagePathOnMoralis, this.nftPartsToDraw);

//         // Upload metadata to the ipfs
//         const uploadedMetadataFile = await MoralisService.UploadFile('nvy/' + entityName + '.json', Buffer.from(this.metadata).toString('base64')) as any;
//         const metadataPathOnMoralis = uploadedMetadataFile.toJSON()[0].path;

//         return metadataPathOnMoralis;
//     }

//     abstract generateMetadata(index: number, maxIndex: number, imagePathOnMoralis: string, nftPartsToDraw: NftSubPartDetails[]);

//     private initiateNftPartsImagePath() {
//         this.nftPartDetails.forEach(nftPart => {
//             for (let i = 1; i < nftPart.subParts.length + 1; i++) {
//                 const nftPartFilePath = __dirname + `\\assets\\${this.nftTypeName}\\${nftPart.resPlural}\\${nftPart.resSingle}_${i}.png`;
//                 nftPart.subParts[i - 1].filePath = nftPartFilePath;
//                 nftPart.subParts[i - 1].index = i - 1;
//             }
//         });
//     }

// }