import { SharedLibraryService } from "@app/shared-library";
import { BlockchainBaseProcessor } from "@app/shared-library/blockchain/blockchain.base.provider";
import { MoralisClient } from "@app/shared-library/moralis/moralis.client";
import { CaptainSettings, CaptainSettingsDocument } from "@app/shared-library/schemas/entity/schema.captain.settings";
import { CaptainTrait, CaptainTraitDocument } from "@app/shared-library/schemas/entity/schema.captain.trait";
import { Collection, CollectionDocument } from "@app/shared-library/schemas/marketplace/schema.collection";
import { CollectionItem, CollectionItemDocument } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { NftType } from "@app/shared-library/shared-library.main";
import { WorkersMint, MintJob } from "@app/shared-library/workers/workers.mint";
import { InjectQueue } from "@nestjs/bull";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Logger } from "@nestjs/common/services";
import { InjectModel } from "@nestjs/mongoose";
import { Queue } from "bull";
import { Model } from "mongoose";
import { GenerateNftImageDto, MintCaptainDto } from "./dto/dto";
import { GenerateNftBehaviour, NftGenerator } from "./queue/nft/nft.generator";
import { NftGeneratorCaptainCronos } from "./queue/nft/nft.generator.captain.cronos";
import { NftGeneratorCaptainVenom } from "./queue/nft/nft.generator.captain.venom";

@Injectable()
export class AppService implements OnModuleInit {

    private cronosNftCaptainGenerator: NftGenerator;
    private venomNftCaptainGenerator: NftGenerator;

    constructor(
        @InjectModel(Collection.name) private readonly collectionModel: Model<CollectionDocument>,
        @InjectModel(CollectionItem.name) private readonly collectionItemModel: Model<CollectionItemDocument>,
        @InjectModel(CaptainTrait.name) private readonly captainTraitModel: Model<CaptainTraitDocument>,
        @InjectModel(CaptainSettings.name) private readonly captainSettingsModel: Model<CaptainSettingsDocument>,
        @InjectQueue(WorkersMint.CronosMintQueue) private readonly cronosMintQueue: Queue,
        @InjectQueue(WorkersMint.VenomMintQueue) private readonly venomMintQueue: Queue) {
    }

    async onModuleInit() {
        MoralisClient.getInstance();

        // const venomCaptainsCollection = await this.collectionModel.findOne({
        //     chainName: SharedLibraryService.VENOM_CHAIN_NAME,
        //     name: BlockchainBaseProcessor.NftTypeToString(NftType.CAPTAIN)
        // }).populate('mint');

        const cronosCaptainsCollection = await this.collectionModel.findOne({
            chainName: SharedLibraryService.CRONOS_CHAIN_NAME,
            name: BlockchainBaseProcessor.NftTypeToString(NftType.CAPTAIN)
        }).populate('mint');

        // this.venomNftCaptainGenerator = new NftGeneratorCaptainVenom(
        //     venomCaptainsCollection,
        //     this.captainTraitModel,
        //     this.captainSettingsModel,
        //     this.collectionItemModel
        // );

        this.cronosNftCaptainGenerator = new NftGeneratorCaptainCronos(
            cronosCaptainsCollection,
            this.captainTraitModel,
            this.captainSettingsModel,
            this.collectionItemModel,
            undefined
        );
    }

    async generateNftImage(dto: GenerateNftImageDto) {
        for (let i = 0; i < dto.amount; i++) {
            switch (dto.collectionName) {
                case 'captains':
                    if (dto.chainName == SharedLibraryService.CRONOS_CHAIN_NAME) {
                        await this.cronosNftCaptainGenerator.generateNftAndUpload(i, 200, GenerateNftBehaviour.SAVE_LOCALLY, dto.nftParts);
                    }
                    if (dto.chainName == SharedLibraryService.VENOM_CHAIN_NAME) {
                        await this.venomNftCaptainGenerator.generateNftAndUpload(i, 200, GenerateNftBehaviour.SAVE_LOCALLY, dto.nftParts);
                    }
                    break;
                default:
                    Logger.error('Unable to generate NFT, unknown collection name: ' + dto.collectionName);
            }
        }
    }

    async mintCaptain(dto: MintCaptainDto) {
        if (dto.chainName == SharedLibraryService.VENOM_CHAIN_NAME) {
            this.venomMintQueue.add({
                nftType: NftType.CAPTAIN,
                owner: dto.owner.toLowerCase(),
                chainName: dto.chainName,
                tokenId: dto.tokenId
            } as MintJob);
        } else if (dto.chainName == SharedLibraryService.CRONOS_CHAIN_NAME) {
            this.cronosMintQueue.add({
                nftType: NftType.CAPTAIN,
                owner: dto.owner.toLowerCase(),
                chainName: dto.chainName,
                tokenId: dto.tokenId
            } as MintJob);
        }

    }

    // TODO move to the queue 
    // async generateCaptainImages() {
    //     for (let i = 1; i < 2; i++) {
    //         console.log(await this.nftCaptainGenerator.generateNft(i, 100, GenerateNftBehaviour.MORALIS_UPLOAD));
    //     }
    // }
}