import { EthersConstants } from "@app/shared-library/ethers/ethers.constants";
import { CaptainSettings, CaptainSettingsDocument } from "@app/shared-library/schemas/entity/schema.captain.settings";
import { CaptainTrait, CaptainTraitDocument } from "@app/shared-library/schemas/entity/schema.captain.trait";
import { Collection, CollectionDocument } from "@app/shared-library/schemas/marketplace/schema.collection";
import { CollectionItem, CollectionItemDocument } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { NftType } from "@app/shared-library/shared-library.main";
import { WorkersMint, MintJob } from "@app/shared-library/workers/workers.mint";
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { OnModuleInit } from "@nestjs/common/interfaces";
import { Logger } from "@nestjs/common/services";
import { InjectModel } from "@nestjs/mongoose";
import { Queue } from "bull";
import { Model } from "mongoose";
import { GenerateNftImageDto, MintCaptainDto } from "./dto/dto";
import { GenerateNftBehaviour, NftGenerator } from "./queue/nft/nft.generator";
import { NftCaptainGenerator } from "./queue/nft/nft.generator.captain";

@Injectable()
export class AppService implements OnModuleInit {

    private nftCaptainGenerator: NftGenerator;

    constructor(
        @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
        @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>,
        @InjectModel(CaptainTrait.name) private captainTraitModel: Model<CaptainTraitDocument>,
        @InjectModel(CaptainSettings.name) private captainSettingsModel: Model<CaptainSettingsDocument>,
        @InjectQueue(WorkersMint.MintQueue) private readonly mintQueue: Queue) {
    }

    async onModuleInit() {
        const captainsCollection = await this.collectionModel.findOne({ name: 'Captains' }).populate('mint');
        this.nftCaptainGenerator = new NftCaptainGenerator(captainsCollection, this.captainTraitModel, this.captainSettingsModel, this.collectionItemModel);
        // await this.generateCaptainImages();
    }

    async generateNftImage(dto: GenerateNftImageDto) {
        for (let i = 0; i < dto.amount; i++) {
            switch (dto.collectionName) {
                case 'captains':
                    await this.nftCaptainGenerator.generateNft(i, 100, GenerateNftBehaviour.SAVE_LOCALLY, dto.nftParts);
                    break;
                default:
                    Logger.error('Unable to generate NFT, unknown collection name: ' + dto.collectionName);
            }
        }
    }

    async mintCaptain(dto: MintCaptainDto) {
        this.mintQueue.add({
            nftType: NftType.CAPTAIN,
            sender: dto.owner.toLowerCase(),
            contractAddress: EthersConstants.CaptainContractAddress
        } as MintJob);
    }

    async generateCaptainImages() {
        for (let i = 1; i < 2; i++) {
            console.log(await this.nftCaptainGenerator.generateNft(i, 100, GenerateNftBehaviour.MORALIS_UPLOAD));
        }
    }
}