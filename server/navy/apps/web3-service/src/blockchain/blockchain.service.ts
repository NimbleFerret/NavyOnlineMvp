import * as Captain from '../abi/Captain.json';
import * as Aks from '../abi/Aks.json';
import * as Nvy from '../abi/Nvy.json';
import * as Ship from '../abi/Ship.json';
import * as Island from '../abi/Island.json';
import * as ShipTemplate from '../abi/ShipTemplate.json';
import * as CollectionSale from '../abi/CollectionSale.json';
import * as Marketplace from '../abi/Marketplace.json';
import {
    Injectable,
    OnModuleInit
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Constants } from '../app.constants';
import { NftType } from '@app/shared-library/shared-library.main';
import { ethers } from 'ethers';
import {
    CheckEthersAuthSignatureRequest,
    CheckEthersAuthSignatureResponse,
} from '@app/shared-library/gprc/grpc.web3.service';
import { EthersProvider } from '@app/shared-library/ethers/ethers.provider';
import { MintJob, WorkersMint } from '@app/shared-library/workers/workers.mint';
import { MarketplaceNftsType, UpdateMarketplaceJob, WorkersMarketplace } from '@app/shared-library/workers/workers.marketplace';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Collection, CollectionDocument } from '@app/shared-library/schemas/marketplace/schema.collection';
import { Mint, MintDocument } from '@app/shared-library/schemas/marketplace/schema.mint';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BlockchainService implements OnModuleInit {

    private readonly ethersProvider = new EthersProvider();

    constructor(
        @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
        @InjectModel(Mint.name) private mintModel: Model<MintDocument>,
        @InjectQueue(WorkersMarketplace.UpdateMarketplaceQueue) private readonly updateMarketplaceQueue: Queue,
        @InjectQueue(WorkersMint.MintQueue) private readonly mintQueue: Queue) { }

    async onModuleInit() {
        await this.ethersProvider.init({
            Captain,
            Aks,
            Nvy,
            Ship,
            Island,
            ShipTemplate,
            CollectionSale,
            Marketplace
        });

        await this.syncSaleContracts();
        await this.syncNftContracts();

        this.ethersProvider.captainCollectionSaleContract.on(EthersProvider.EventGenerateToken, async (sender: string, contractAddress: string) => {
            this.mintQueue.add({
                nftType: NftType.CAPTAIN,
                sender,
                contractAddress
            } as MintJob);
        });
    }

    checkEthersAuthSignature(request: CheckEthersAuthSignatureRequest) {
        const signerAddr = ethers.utils.verifyMessage(Constants.AuthSignatureTemplate.replace('@', request.address), request.signedMessage)
        return {
            success: signerAddr == request.address
        } as CheckEthersAuthSignatureResponse;
    }

    // TODO better to listen for events
    @Cron(CronExpression.EVERY_5_MINUTES)
    async syncSaleContracts() {
        this.updateMarketplaceQueue.empty();
        this.updateMarketplaceQueue.add({
            marketplaceNftsType: MarketplaceNftsType.LISTED,
            nftType: NftType.CAPTAIN
        } as UpdateMarketplaceJob);
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async syncNftContracts() {
        this.updateMarketplaceQueue.empty();
        this.updateMarketplaceQueue.add({
            marketplaceNftsType: MarketplaceNftsType.ALL,
            nftType: NftType.CAPTAIN
        } as UpdateMarketplaceJob);
    }

}