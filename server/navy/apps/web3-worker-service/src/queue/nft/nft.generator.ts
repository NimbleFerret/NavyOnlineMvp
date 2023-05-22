import { SharedLibraryService, SelectPercentageOptions } from "@app/shared-library";
import { Rarity, NftType } from "@app/shared-library/shared-library.main";
import { NftSubPartDetails, NftPartDetails } from "@app/shared-library/workers/workers.marketplace";
import { Collection } from "@app/shared-library/schemas/marketplace/schema.collection";
import { v4 as uuidv4 } from 'uuid';
import { createCanvas, loadImage } from "canvas";
import { NftPart } from "../../dto/dto";
import { MoralisClient } from "@app/shared-library/moralis/moralis.client";

const fs = require("fs");

export enum GenerateNftBehaviour {
    MORALIS_UPLOAD,
    SAVE_LOCALLY
}

export abstract class NftGenerator {

    metadata: string;
    rarity: Rarity;

    private nftImagesMap = new Map<string, string[]>();
    private nftPartDetails: NftPartDetails[] = [];
    private nftPartsToDraw: NftSubPartDetails[] = [];
    private nftTypeName: string;

    constructor(public nftType: NftType, collection: Collection) {
        this.init().then(f => {
            // Convert initial data
            this.nftPartDetails = collection.mint.nftPartsItems.map(nftPartsItem => {
                const nftPartDetails = {
                    resPlural: nftPartsItem.categoryPlural,
                    resSingle: nftPartsItem.categorySingle,
                    subParts: []
                } as NftPartDetails;

                nftPartDetails.subParts = nftPartsItem.categoryDetails.map(categoryDetails => {
                    let rarity = Rarity.COMMON;
                    switch (categoryDetails.rarity) {
                        case 'Rare':
                            rarity = Rarity.RARE;
                            break;
                        case 'Epic':
                            rarity = Rarity.EPIC;
                            break;
                        case 'Legendary':
                            rarity = Rarity.LEGENDARY;
                            break;
                        case 'All':
                            rarity = Rarity.ALL;
                            break;
                    }
                    return {
                        chance: categoryDetails.chancePercent,
                        rarity
                    } as NftSubPartDetails;
                });
                return nftPartDetails;
            });

            // Load image paths
            switch (nftType) {
                case NftType.CAPTAIN:
                    this.nftTypeName = 'captain';
                    break;
                case NftType.SHIP:
                    this.nftTypeName = 'ship';
                    break;
                case NftType.ISLAND:
                    this.nftTypeName = 'island';
                    break;
            }
            this.initiateNftPartsImagePath();

            // Sort nft parts by rarity
            this.nftPartDetails.forEach(nftPart => {
                nftPart.subParts = nftPart.subParts.sort(function (a, b) { return b.rarity - a.rarity });
            });
        });
    }

    public async generateNftAndUpload(index: number, maxIndex: number, saveBahaviour: GenerateNftBehaviour = GenerateNftBehaviour.MORALIS_UPLOAD, predefinedNftParts?: NftPart[]) {
        const basicCanvas = createCanvas(72, 72);
        const basicContext = basicCanvas.getContext('2d');
        const resultCanvas = createCanvas(72 * 2, 72 * 2);
        const resultContext = resultCanvas.getContext('2d');
        this.rarity = SharedLibraryService.GenerateRarity();

        async function drawScaledImage(imagePartPath: string) {
            const image = await loadImage(imagePartPath);
            basicContext.drawImage(image, 0, 0, 72, 72);

            let tX = 0;
            let tY = 0;

            for (let x = 0; x < 72; x++) {
                if (x > 0) {
                    tX += 2;
                }
                for (let y = 0; y < 72; y++) {
                    const pixelData = basicContext.getImageData(x, y, 1, 1);

                    if (y > 0) {
                        tY += 2;
                    }

                    resultContext.putImageData(pixelData, tX, tY);
                    resultContext.putImageData(pixelData, tX, tY + 1);
                    resultContext.putImageData(pixelData, tX + 1, tY);
                    resultContext.putImageData(pixelData, tX + 1, tY + 1);
                }
                tY = 0;
            }
        }
        if (!predefinedNftParts) {
            for (const nftPart of this.nftPartDetails) {
                const selectPercentageOptions: SelectPercentageOptions<NftSubPartDetails>[] = [];

                for (let index = 0; index < nftPart.subParts.length; index++) {
                    if (nftPart.subParts[index].rarity === this.rarity || nftPart.subParts[index].rarity == Rarity.ALL) {
                        const value = nftPart.subParts[index];
                        const percentage = value.chance;
                        selectPercentageOptions.push({ value, percentage });
                    }
                }

                const nftPartToDraw = SharedLibraryService.SelectItemByPercentage(selectPercentageOptions);

                if (nftPartToDraw) {
                    this.nftPartsToDraw.push(nftPartToDraw);
                    await drawScaledImage(nftPartToDraw.filePath);
                }
            }
        } else {
            for (const predefinedNftPart of predefinedNftParts) {
                const imageFilePath = this.nftImagesMap.get(predefinedNftPart.name)[predefinedNftPart.index - 1];
                await drawScaledImage(imageFilePath);
            }
        }

        // Upload image to the ipfs
        const entityName = uuidv4();
        const fileBuffer = resultCanvas.toBuffer('image/png');

        if (saveBahaviour == GenerateNftBehaviour.MORALIS_UPLOAD) {
            const uploadedImageFile = await MoralisClient.getInstance().uploadFile('nvy/' + entityName + '.png', fileBuffer.toString('base64')) as any;
            const imagePathOnMoralis = uploadedImageFile.toJSON()[0].path;

            await this.generateNftMetadata(index, maxIndex, imagePathOnMoralis, this.nftPartsToDraw);

            // Upload metadata to the ipfs
            const uploadedMetadataFile = await MoralisClient.getInstance().uploadFile('nvy/' + entityName + '.json', Buffer.from(this.metadata).toString('base64')) as any;
            const metadataPathOnMoralis = uploadedMetadataFile.toJSON()[0].path;
            return metadataPathOnMoralis;
        } else {
            const fileName = this.nftTypeName + index + '.png';
            fs.writeFileSync(fileName, fileBuffer);
            return fileName;
        }
    }

    public async mintAndSaveNft(owner: string, metadataUrl: string, nftContractAddress: string) {
        await this.mintNft(owner, metadataUrl);
        await this.saveCollectionItem(owner, nftContractAddress, metadataUrl);
    }

    // -------------------------------
    // Abstract functions
    // -------------------------------

    protected abstract init(): Promise<any>;
    protected abstract mintNft(owner: string, metadataUrl: string);
    protected abstract saveCollectionItem(owner: string, nftContractAddress: string, metadataUrl: string);
    protected abstract generateNftMetadata(index: number, maxIndex: number, imagePathOnMoralis: string, nftPartsToDraw: NftSubPartDetails[]);

    // -------------------------------

    private initiateNftPartsImagePath() {
        this.nftPartDetails.forEach(nftPart => {
            for (let i = 0; i < nftPart.subParts.length; i++) {
                const nftPartFilePath = __dirname + `/assets/${this.nftTypeName}/${nftPart.resPlural}/${nftPart.resSingle}_${i + 1}.png`;

                nftPart.subParts[i].filePath = nftPartFilePath;
                nftPart.subParts[i].index = i;

                if (this.nftImagesMap.has(nftPart.resSingle)) {
                    this.nftImagesMap.get(nftPart.resSingle).push(nftPartFilePath);
                } else {
                    this.nftImagesMap.set(nftPart.resSingle, [nftPartFilePath]);
                }
            }
        });
    }

}