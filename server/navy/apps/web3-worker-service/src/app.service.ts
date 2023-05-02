import { Collection, CollectionDocument } from "@app/shared-library/schemas/marketplace/schema.collection";
import { Mint, MintDocument } from "@app/shared-library/schemas/marketplace/schema.mint";
import { Injectable } from "@nestjs/common";
import { OnModuleInit } from "@nestjs/common/interfaces";
import { Logger } from "@nestjs/common/services";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GenerateNftImageDto } from "./dto/dto";
import { GenerateNftBehaviour, NftGenerator } from "./queue/nft/nft.generator";
import { NftCaptainGenerator } from "./queue/nft/nft.generator.captain";

@Injectable()
export class AppService implements OnModuleInit {

    private nftCaptainGenerator: NftGenerator;

    constructor(
        @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
        @InjectModel(Mint.name) private mintModel: Model<MintDocument>) {
    }

    async onModuleInit() {
        const captainsCollection = await this.collectionModel.findOne({ name: 'Captains' }).populate('mint');
        this.nftCaptainGenerator = new NftCaptainGenerator(captainsCollection);
        // await this.generateCaptainImages();
    }

    async generateNftImage(dto: GenerateNftImageDto) {
        switch (dto.collectionName) {
            case 'captains':
                await this.nftCaptainGenerator.generateNft(dto.index, 100, GenerateNftBehaviour.SAVE_LOCALLY, dto.nftParts);
                break;
            default:
                Logger.error('Unable to generate NFT, unknown collection name: ' + dto.collectionName);
        }
    }

    async generateCaptainImages() {
        for (let i = 1; i < 21; i++) {
            await this.nftCaptainGenerator.generateNft(i, 100, GenerateNftBehaviour.SAVE_LOCALLY);
        }
    }
}