import { EntityService, EntityServiceGrpcClientName, EntityServiceName } from "@app/shared-library/gprc/grpc.entity.service";
import { Collection, CollectionDocument } from "@app/shared-library/schemas/marketplace/schema.collection";
import { Inject, Injectable } from "@nestjs/common";
import { OnModuleInit } from "@nestjs/common/interfaces";
import { Logger } from "@nestjs/common/services";
import { ClientGrpc } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GenerateNftImageDto } from "./dto/dto";
import { GenerateNftBehaviour, NftGenerator } from "./queue/nft/nft.generator";
import { NftCaptainGenerator } from "./queue/nft/nft.generator.captain";

@Injectable()
export class AppService implements OnModuleInit {

    private entityService: EntityService;
    private nftCaptainGenerator: NftGenerator;

    constructor(
        @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
        @Inject(EntityServiceGrpcClientName) private readonly entityServiceGrpcClient: ClientGrpc) {
    }

    async onModuleInit() {
        this.entityService = this.entityServiceGrpcClient.getService<EntityService>(EntityServiceName);
        const captainsCollection = await this.collectionModel.findOne({ name: 'Captains' }).populate('mint');
        this.nftCaptainGenerator = new NftCaptainGenerator(captainsCollection, this.entityService);
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

    async generateCaptainImages() {
        for (let i = 1; i < 2; i++) {
            console.log(await this.nftCaptainGenerator.generateNft(i, 100, GenerateNftBehaviour.MORALIS_UPLOAD));
        }
    }
}