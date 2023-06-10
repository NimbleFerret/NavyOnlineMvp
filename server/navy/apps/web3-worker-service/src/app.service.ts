import { MoralisClient } from "@app/shared-library/moralis/moralis.client";
import { NftType } from "@app/shared-library/shared-library.main";
import { WorkersMint, MintJob } from "@app/shared-library/workers/workers.mint";
import { InjectQueue } from "@nestjs/bull";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Logger } from "@nestjs/common/services";
import { Queue } from "bull";
import { GenerateNftImageDto, MintCaptainDto } from "./dto/dto";
import { GenerateNftBehaviour, NftGenerator } from "./queue/nft/nft.generator";

@Injectable()
export class AppService implements OnModuleInit {

    private nftCaptainGenerator: NftGenerator;

    constructor() {
        // @InjectQueue(WorkersMint.MintQueue) private readonly mintQueue: Queue) {
    }

    async onModuleInit() {
        MoralisClient.getInstance();
    }

    // async generateNftImage(dto: GenerateNftImageDto) {
    //     for (let i = 0; i < dto.amount; i++) {
    //         switch (dto.collectionName) {
    //             case 'captains':
    //                 await this.nftCaptainGenerator.generateNft(i, 100, GenerateNftBehaviour.SAVE_LOCALLY, dto.nftParts);
    //                 break;
    //             default:
    //                 Logger.error('Unable to generate NFT, unknown collection name: ' + dto.collectionName);
    //         }
    //     }
    // }

    // async mintCaptain(dto: MintCaptainDto) {
    //     this.mintQueue.add({
    //         nftType: NftType.CAPTAIN,
    //         sender: dto.owner.toLowerCase(),
    //         contractAddress: EthersConstants.CaptainContractAddress,
    //         tokenId: dto.tokenId
    //     } as MintJob);
    // }

    // TODO move to the queue 
    // async generateCaptainImages() {
    //     for (let i = 1; i < 2; i++) {
    //         console.log(await this.nftCaptainGenerator.generateNft(i, 100, GenerateNftBehaviour.MORALIS_UPLOAD));
    //     }
    // }
}