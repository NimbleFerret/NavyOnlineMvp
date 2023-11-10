
import { SharedLibraryService } from '@app/shared-library';
import { BlockchainTransaction, BlockchainTransactionDocument } from '@app/shared-library/schemas/blockchain/schema.blockchain.transaction';
import { CaptainSettings, CaptainSettingsDocument } from '@app/shared-library/schemas/entity/schema.captain.settings';
import { CaptainTrait, CaptainTraitDocument } from '@app/shared-library/schemas/entity/schema.captain.trait';
import { Collection, CollectionDocument } from '@app/shared-library/schemas/marketplace/schema.collection';
import { CollectionItem, CollectionItemDocument } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { WorkersMarketplace } from '@app/shared-library/workers/workers.marketplace';
import { Processor } from '@nestjs/bull';
import { OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueueMintBaseProcessor } from './queue.mint.base.processor';
import { NftType } from '@app/shared-library/shared-library.main';
import { BlockchainBaseProcessor } from '@app/shared-library/blockchain/blockchain.base.provider';
import { NftGeneratorCaptainVenom } from '../../nft/nft.generator.captain.venom';
import { VenomProvider } from '@app/shared-library/blockchain/venom/venom.provider';
import { ConfigService } from '@nestjs/config';

@Processor(WorkersMarketplace.VenomMintQueue)
export class QueueMintVenomProcessor extends QueueMintBaseProcessor implements OnModuleInit {

    private readonly venomProvider: VenomProvider;

    constructor(
        configService: ConfigService,
        @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
        @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>,
        @InjectModel(CaptainTrait.name) private captainTraitModel: Model<CaptainTraitDocument>,
        @InjectModel(CaptainSettings.name) private captainSettingsModel: Model<CaptainSettingsDocument>,
        @InjectModel(BlockchainTransaction.name) blockchainTransactionModel: Model<BlockchainTransactionDocument>
    ) {
        super(SharedLibraryService.VENOM_CHAIN_NAME, blockchainTransactionModel);
        this.venomProvider = new VenomProvider(configService);
    }

    async onModuleInit() {
        await this.venomProvider.init();

        const captainsCollection = await this.collectionModel.findOne({
            chainName: SharedLibraryService.VENOM_CHAIN_NAME,
            name: BlockchainBaseProcessor.NftTypeToString(NftType.CAPTAIN)
        }).populate('mint');

        this.nftCaptainGenerator = new NftGeneratorCaptainVenom(
            captainsCollection,
            this.captainTraitModel,
            this.captainSettingsModel,
            this.collectionItemModel
        );
    }

    async getCollectionTotalSupply(nftType: NftType): Promise<number> {
        switch (nftType) {
            case NftType.CAPTAIN:
                return await this.venomProvider.getCaptainsCollectionSize();
            case NftType.SHIP:
            case NftType.ISLAND:
                return 0;
        }
    }

    async getCollectionCurrentSupply(nftType: NftType): Promise<number> {
        switch (nftType) {
            case NftType.CAPTAIN:
                return await this.venomProvider.getCaptainsTotalSupply();
            case NftType.SHIP:
            case NftType.ISLAND:
                return 0;
        }
    }

}