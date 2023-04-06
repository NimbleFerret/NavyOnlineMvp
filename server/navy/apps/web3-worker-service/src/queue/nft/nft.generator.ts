import { SharedLibraryService, SelectPercentageOptions } from "@app/shared-library";
import { Rarity, NftType } from "@app/shared-library/shared-library.main";
import { NftSubPartDetails, NftPartDetails } from "@app/shared-library/workers/workers.marketplace";
import { v4 as uuidv4 } from 'uuid';
import { createCanvas, loadImage } from "canvas";
import { MoralisClient } from "@app/shared-library/moralis/moralis.client";
import { Contract } from "ethers";

export abstract class NftGenerator {

    metadata: string;
    rarity: Rarity;
    private nftPartsToDraw: NftSubPartDetails[] = [];
    private nftTypeName: string;
    private moralisClient = new MoralisClient();

    constructor(public nftType: NftType, private nftPartDetails: NftPartDetails[]) {
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
    }

    public async initMoralis() {
        await this.moralisClient.init();
    }

    public async generateNft(index: number, maxIndex: number) {
        const canvas = createCanvas(72, 72);
        const ctx = canvas.getContext('2d');

        this.rarity = SharedLibraryService.GenerateRarity();

        // Sort subparts by rarity
        this.nftPartDetails.forEach(nftPart => {
            nftPart.subParts = nftPart.subParts.map(subPart => {
                if (this.rarity >= subPart.rarity) {
                    return subPart;
                }
            }).filter(f => f).sort(function (a, b) { return b.rarity - a.rarity });
        });

        for (const nftPart of this.nftPartDetails) {
            const selectPercentageOptions: SelectPercentageOptions<NftSubPartDetails>[] = []

            // Select subpart within rarity by random chance
            for (let index = 0; index < nftPart.subParts.length; index++) {
                const value = nftPart.subParts[index];
                const percentage = value.chance;
                if (index == 0 || selectPercentageOptions[0].value.rarity == nftPart.subParts[index].rarity) {
                    selectPercentageOptions.push({ value, percentage });
                }
            }
            const nftPartToDraw = SharedLibraryService.SelectItemByPercentage(selectPercentageOptions);
            this.nftPartsToDraw.push(nftPartToDraw);

            // Draw each part
            const image = await loadImage(nftPartToDraw.filePath);
            ctx.drawImage(image, 0, 0, 72, 72);
        }

        // Upload image to the ipfs
        const entityName = uuidv4();
        const fileBuffer = canvas.toBuffer('image/png');
        const uploadedImageFile = await this.moralisClient.uploadFile('nvy/' + entityName + '.png', fileBuffer.toString('base64')) as any;
        const imagePathOnMoralis = uploadedImageFile.toJSON()[0].path;

        this.generateNftMetadata(index, maxIndex, imagePathOnMoralis, this.nftPartsToDraw);

        // Upload metadata to the ipfs
        const uploadedMetadataFile = await this.moralisClient.uploadFile('nvy/' + entityName + '.json', Buffer.from(this.metadata).toString('base64')) as any;
        const metadataPathOnMoralis = uploadedMetadataFile.toJSON()[0].path;

        return metadataPathOnMoralis;
    }

    abstract generateNftMetadata(index: number, maxIndex: number, imagePathOnMoralis: string, nftPartsToDraw: NftSubPartDetails[]);

    abstract mintNft(owner: string, contract: Contract, tokenUri: string);

    private initiateNftPartsImagePath() {
        this.nftPartDetails.forEach(nftPart => {
            for (let i = 1; i < nftPart.subParts.length + 1; i++) {
                const nftPartFilePath = __dirname + `\\assets\\${this.nftTypeName}\\${nftPart.resPlural}\\${nftPart.resSingle}_${i}.png`;
                nftPart.subParts[i - 1].filePath = nftPartFilePath;
                nftPart.subParts[i - 1].index = i - 1;
            }
        });
    }

}