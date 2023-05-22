
import * as Captain from '../abi/Captain.json';
import * as Aks from '../abi/Aks.json';
import * as Nvy from '../abi/Nvy.json';
import * as Ship from '../abi/Ship.json';
import * as Island from '../abi/Island.json';
import * as CollectionSale from '../abi/CollectionSale.json';
import * as Marketplace from '../abi/Marketplace.json';
import { SharedLibraryService } from '@app/shared-library';
import { CronosProvider } from '@app/shared-library/blockchain/cronos/cronos.provider';
import { BlockchainTransaction, BlockchainTransactionDocument } from '@app/shared-library/schemas/blockchain/schema.blockchain.transaction';
import { CaptainSettings, CaptainSettingsDocument } from '@app/shared-library/schemas/entity/schema.captain.settings';
import { CaptainTrait, CaptainTraitDocument } from '@app/shared-library/schemas/entity/schema.captain.trait';
import { Collection, CollectionDocument } from '@app/shared-library/schemas/marketplace/schema.collection';
import { CollectionItem, CollectionItemDocument } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { WorkersMint } from '@app/shared-library/workers/workers.mint';
import { Processor } from '@nestjs/bull';
import { OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NftGeneratorCaptainCronos } from './nft/nft.generator.captain.cronos';
import { QueueMintBaseProcessor } from './queue.mint.base.processor';
import { NftType } from '@app/shared-library/shared-library.main';
import { BlockchainBaseProcessor } from '@app/shared-library/blockchain/blockchain.base.provider';

@Processor(WorkersMint.CronosMintQueue)
export class QueueMintCronosProcessor extends QueueMintBaseProcessor implements OnModuleInit {

    private readonly cronosProvider = new CronosProvider();

    constructor(
        @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
        @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>,
        @InjectModel(CaptainTrait.name) private captainTraitModel: Model<CaptainTraitDocument>,
        @InjectModel(CaptainSettings.name) private captainSettingsModel: Model<CaptainSettingsDocument>,
        @InjectModel(BlockchainTransaction.name) blockchainTransactionModel: Model<BlockchainTransactionDocument>
    ) {
        super(SharedLibraryService.CRONOS_CHAIN_NAME, blockchainTransactionModel);
    }

    async onModuleInit() {
        await this.cronosProvider.init({
            Captain,
            Aks,
            Nvy,
            Ship,
            Island,
            CollectionSale,
            Marketplace
        });

        const captainsCollection = await this.collectionModel.findOne({
            chainName: SharedLibraryService.CRONOS_CHAIN_NAME,
            name: BlockchainBaseProcessor.NftTypeToString(NftType.CAPTAIN)
        }).populate('mint');

        this.nftCaptainGenerator = new NftGeneratorCaptainCronos(
            captainsCollection,
            this.captainTraitModel,
            this.captainSettingsModel,
            this.collectionItemModel,
            this.cronosProvider.captainContract
        );
    }

    async getCollectionTotalSupply(nftType: NftType): Promise<number> {
        switch (nftType) {
            case NftType.CAPTAIN:
                return await (this.cronosProvider.captainCollectionContract.totalSupply()).toNumber();
            case NftType.SHIP:
                return await (this.cronosProvider.shipCollectionContract.totalSupply()).toNumber();
            case NftType.ISLAND:
                return await (this.cronosProvider.islandCollectionContract.totalSupply()).toNumber();
        }
    }

    async getCollectionCurrentSupply(nftType: NftType): Promise<number> {
        switch (nftType) {
            case NftType.CAPTAIN:
                return await (this.cronosProvider.captainCollectionContract.currentSupply()).toNumber();
            case NftType.SHIP:
                return await (this.cronosProvider.shipCollectionContract.currentSupply()).toNumber();
            case NftType.ISLAND:
                return await (this.cronosProvider.islandCollectionContract.currentSupply()).toNumber();
        }
    }

}