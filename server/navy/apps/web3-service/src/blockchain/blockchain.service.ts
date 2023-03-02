import * as Captain from '../abi/Captain.json';
import * as Aks from '../abi/Aks.json';
import * as Nvy from '../abi/Nvy.json';
import * as Ship from '../abi/Ship.json';
import * as Island from '../abi/Island.json';
import * as ShipTemplate from '../abi/ShipTemplate.json';
import * as CollectionSale from '../abi/CollectionSale.json';
import * as Marketplace from '../abi/Marketplace.json';
import {
    BadRequestException,
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
    CollectionType,
    GetMarketplaceListedNFTsRequest,
    GetMarketplaceListedNFTsResponse
} from '@app/shared-library/gprc/grpc.web3.service';
import { EthersProvider } from '@app/shared-library/ethers/ethers.provider';
import { MintJob, WorkersMint } from '@app/shared-library/workers/workers.mint';
import { MarketplaceNftsType, UpdateMarketplaceJob, WorkersMarketplace } from '@app/shared-library/workers/workers.marketplace';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BlockchainService implements OnModuleInit {

    private readonly ethersProvider = new EthersProvider();

    constructor(
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

    async getMarketplaceListedNFTs(request: GetMarketplaceListedNFTsRequest) {
        if (request.collectionType == CollectionType.CAPTAIN) {
            return {
                listedNFTs: []
                // listedNFTs: this.listedCaptains
            } as GetMarketplaceListedNFTsResponse;
        } else {
            throw new BadRequestException();
        }
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async syncListedNFTs() {
        this.updateMarketplaceQueue.add({
            marketplaceNftsType: MarketplaceNftsType.LISTED,
            nftType: NftType.CAPTAIN
        } as UpdateMarketplaceJob);
    }

}