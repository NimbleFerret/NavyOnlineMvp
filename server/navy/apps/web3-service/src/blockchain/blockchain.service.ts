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
    Logger,
    OnModuleInit
} from '@nestjs/common';
import { InjectQueue, OnQueueActive } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { Constants } from '../app.constants';
// import { NftCaptainGenerator } from '../nft/nft.generator.captain';
import { NftType, Rarity } from '@app/shared-library/shared-library.main';
import { Contract, ethers } from 'ethers';
import {
    CheckEthersAuthSignatureRequest,
    CheckEthersAuthSignatureResponse,
    CollectionType,
    GetCollectionSaleDetailsRequest,
    GetCollectionSaleDetailsResponse,
    GetMarketplaceListedNFTsRequest,
    GetMarketplaceListedNFTsResponse
} from '@app/shared-library/gprc/grpc.web3.service';
import { MoralisService } from '../moralis/moralis.service';
import { Cron, CronExpression } from '@nestjs/schedule';
// import { BlockchainCollectionCaptain } from './blockchain.collection.captain';
import { NFTService } from '../nft/nft.service';
import { EthersProvider } from '@app/shared-library/ethers/ethers.provider';
import { MintJob, WorkersMint } from '@app/shared-library/workers/workers.mint';
import { MarketplaceNftsType, UpdateMarketplaceJob, WorkersMarketplace } from '@app/shared-library/workers/workers.marketplace';

// -----------------------------------------
// These stats are used to generate new NFTs
// -----------------------------------------

export interface CaptainStats {
    currentLevel: number;
    maxLevel: number;
    traits: string;
    rarity: number;
    staking: boolean,
    stakingRewardNVY: number;
    stakingStartedAt: number;
    stakingDurationSeconds: number;
}

export interface IslandStats {
    level: number;
    rarity: number;
    mining: boolean;
    terrain: number;
    miningStartedAt: number;
    miningDurationSeconds: number;
    miningRewardNVY: number;
    shipAndCaptainFee: number;
    currMiners: number;
    maxMiners: number;
    minersFee: number;
    x: number;
    y: number;
}

export interface ShipStatsRange {
    minArmor: number;
    maxArmor: number;
    minHull: number;
    maxHull: number;
    minMaxSpeed: number;
    maxMaxSpeed: number;
    minAccelerationStep: number;
    maxAccelerationStep: number;
    minAccelerationDelay: number;
    maxAccelerationDelay: number;
    minRotationDelay: number;
    maxRotationDelay: number;
    minFireDelay: number;
    maxFireDelay: number;
    minCannons: number;
    maxCannons: number;
    minCannonsRange: number;
    maxCannonsRange: number;
    minCannonsDamage: number;
    maxCannonsDamage: number;
    minIntegrity: number;
    maxIntegrity: number;
}

export interface ShipStatsStep {
    armorAndHullStep: number;
    speedAndAccelerationStep: number;
    inputDelayStep: number;
    cannonsStep: number;
    cannonsRangeStep: number;
    cannonsDamageStep: number;
    integrityStep: number;
}

@Injectable()
export class BlockchainService implements OnModuleInit {

    // private nftCaptainGenerator = new NftCaptainGenerator();

    // private shipStatsStep: ShipStatsStep;
    // private smallShipStatsRange: ShipStatsRange;
    // private middleShipStatsRange: ShipStatsRange;

    // private blockchainCollectionCaptain: BlockchainCollectionCaptain;

    private readonly ethersProvider = new EthersProvider();


    constructor(
        // private readonly nftService: NFTService,
        // private readonly ethersProvider: EthersProvider,
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

        // export interface UpdateMarketplaceJob {
        //     marketplaceNftsType: MarketplaceNftsType;
        //     nftType: NftType;
        // }

        this.ethersProvider.captainCollectionSaleContract.on(EthersProvider.EventGenerateToken, async (sender: string, contractAddress: string) => {
            this.mintQueue.add({
                nftType: NftType.CAPTAIN,
                sender,
                contractAddress
            } as MintJob);
        });

        setTimeout(() => {
            this.updateMarketplaceQueue.add({
                marketplaceNftsType: MarketplaceNftsType.LISTED,
                nftType: NftType.CAPTAIN
            } as UpdateMarketplaceJob);
        }, 500);

        // this.blockchainCollectionCaptain = new BlockchainCollectionCaptain(
        //     this.nftService.nftCaptainGenerator,
        //     this.ethersProvider.captainCollectionSaleContract,
        //     this.ethersProvider.captainContract,
        //     this.ethersProvider.captainMarketplaceContract
        // );

        // this.blockchainCollectionCaptain.updateMarketplaceNfts();

        // await this.syncListedNFTs();

        // TODO get info about contracts...
        // this.ethersProvider.captainCollectionSaleContract.on(EthersProvider.EventGenerateToken, async (sender: string, contractAddress: string) => {
        //     try {
        //         // TODO move this to the BULL job and add logging stuff for the database
        //         Logger.log(`Generating new captain for user: ${sender}. contractAddress: ${contractAddress}`);

        //         if (contractAddress.toLocaleLowerCase() == Constants.CaptainContractAddress) {
        //             // TODO replace tokens total by tokens left
        //             const tokensLeft = (await this.ethersProvider.captainCollectionSaleContract.tokensLeft()).toNumber();
        //             const tokensTotal = (await this.ethersProvider.captainCollectionSaleContract.tokensTotal()).toNumber();

        //             // TODO compare all on chain params and deploy a new contract
        //             const captainStats = {
        //                 currentLevel: 1,
        //                 maxLevel: 10,
        //                 traits: '',
        //                 rarity: Rarity.LEGENDARY,
        //                 staking: false,
        //                 stakingRewardNVY: 5,
        //                 stakingStartedAt: 0,
        //                 stakingDurationSeconds: 120,
        //             } as CaptainStats;

        //             // const captainMetadata = await this.nftCaptainGenerator.generateCaptain(
        //             //     tokensLeft,
        //             //     tokensTotal,
        //             //     captainStats
        //             // );

        //             // await this.ethersProvider.captainContract.grantCaptain(sender, ethers.BigNumber.from(5), ethers.BigNumber.from(120), captainMetadata);

        //             Logger.log(`Captain granted to: ${sender}`);

        //             MoralisService.UpdateCollections = true;
        //         } else {
        //             Logger.error(`Wrong contract address! Expected captain address: ${Constants.CaptainContractAddress}, received: ${contractAddress}`);
        //         }
        //     } catch (e) {
        //         Logger.error(e);
        //     }
        // });

        // this.ethersProvider.shipCollectionSaleContract.on(EthersProvider.EventGenerateToken, async (sender: string, contractAddress: string) => {
        //     try {
        //         Logger.log(`Generating new ship for user: ${sender}...`);
        //         if (contractAddress == Constants.ShipContractAddress) {

        //         } else {
        //             Logger.error(`Wrong contract address! Expected ship address: ${Constants.ShipContractAddress}, received: ${contractAddress}`);
        //         }
        //     } catch (e) {
        //         Logger.error(e);
        //     }
        // });

        // this.ethersProvider.islandCollectionSaleContract.on(EthersProvider.EventGenerateToken, async (sender: string, contractAddress: string) => {
        //     try {
        //         Logger.log(`Generating new island for user: ${sender}...`);
        //         if (contractAddress == Constants.IslandContractAddress) {

        //         } else {
        //             Logger.error(`Wrong contract address! Expected island address: ${Constants.IslandContractAddress}, received: ${contractAddress}`);
        //         }
        //     } catch (e) {
        //         Logger.error(e);
        //     }
        // });
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

    // Писать в базу, добавить последние листинги, продажи и тд
    // private listedCaptains: ListedNFT[] = [];

    @Cron(CronExpression.EVERY_MINUTE)
    async syncListedNFTs() {
        // this.listedCaptains = await this.updateMarketplaceListedNfts(this.ethersProvider.captainMarketplaceContract, this.ethersProvider.captainContract);
        // this.blockchainCollectionCaptain.updateMarketplaceNfts();
    }

    async getCollectionSaleDetails(request: GetCollectionSaleDetailsRequest) {
        const response = {} as GetCollectionSaleDetailsResponse;
        if (request.address == Constants.CaptainCollectionSaleContractAddress) {
            const tokensTotal = await this.ethersProvider.captainCollectionSaleContract.tokensTotal();
            const tokensLeft = await this.ethersProvider.captainCollectionSaleContract.tokensLeft();
            response.tokensTotal = tokensTotal;
            response.tokensLeft = tokensLeft;
        } else if (request.address == Constants.ShipCollectionSaleContractAddress) {
            const tokensTotal = await this.ethersProvider.shipCollectionSaleContract.tokensTotal();
            const tokensLeft = await this.ethersProvider.shipCollectionSaleContract.tokensLeft();
            response.tokensTotal = tokensTotal;
            response.tokensLeft = tokensLeft;
        } else if (request.address == Constants.IslandCollectionSaleContractAddress) {
            const tokensTotal = await this.ethersProvider.islandCollectionSaleContract.tokensTotal();
            const tokensLeft = await this.ethersProvider.islandCollectionSaleContract.tokensLeft();
            response.tokensTotal = tokensTotal;
            response.tokensLeft = tokensLeft;
        } else {
            throw new BadRequestException();
        }
        return response;
    }

    // private async updateMarketplaceListedNfts(marketplaceContract: Contract, nftContract: Contract) {
    //     const listedNfts = await marketplaceContract.getListedNfts();

    //     const marketplaceNFTs: ListedNFT[] = listedNfts.map(listedNft => {
    //         const marketplaceNFT: ListedNFT = {
    //             nftContract: listedNft.nftContract,
    //             tokenId: listedNft.tokenId.toNumber(),
    //             seller: listedNft.seller,
    //             owner: listedNft.owner,
    //             price: ethers.utils.formatEther(listedNft.price),
    //             image: ''
    //         };
    //         return marketplaceNFT;
    //     });

    //     for (const nft of marketplaceNFTs) {
    //         const nftURI = await nftContract.tokenURI(nft.tokenId);
    //         const response = await fetch(nftURI);
    //         const body = await response.json();
    //         nft.image = body.image;
    //     }

    //     return marketplaceNFTs;
    // }

    // private async updateAndSetShipStats() {
    //     const shipStatsStep = await this.ethersProvider.shipTemplateContract.getShipStatsStep();
    //     const smallShipParams = await this.ethersProvider.shipTemplateContract.getSmallShipStats();
    //     const middleShipParams = await this.ethersProvider.shipTemplateContract.getMiddleShipStats();

    //     this.shipStatsStep = {
    //         armorAndHullStep: shipStatsStep[0].toNumber(),
    //         speedAndAccelerationStep: shipStatsStep[1].toNumber(),
    //         inputDelayStep: shipStatsStep[2].toNumber(),
    //         cannonsStep: shipStatsStep[3].toNumber(),
    //         cannonsRangeStep: shipStatsStep[4].toNumber(),
    //         cannonsDamageStep: shipStatsStep[5].toNumber(),
    //         integrityStep: shipStatsStep[6].toNumber()
    //     }

    //     this.smallShipStatsRange = {
    //         minArmor: smallShipParams[0].toNumber(),
    //         maxArmor: smallShipParams[1].toNumber(),
    //         minHull: smallShipParams[2].toNumber(),
    //         maxHull: smallShipParams[3].toNumber(),
    //         minMaxSpeed: smallShipParams[4].toNumber(),
    //         maxMaxSpeed: smallShipParams[5].toNumber(),
    //         minAccelerationStep: smallShipParams[6].toNumber(),
    //         maxAccelerationStep: smallShipParams[7].toNumber(),
    //         minAccelerationDelay: smallShipParams[8].toNumber(),
    //         maxAccelerationDelay: smallShipParams[9].toNumber(),
    //         minRotationDelay: smallShipParams[10].toNumber(),
    //         maxRotationDelay: smallShipParams[11].toNumber(),
    //         minFireDelay: smallShipParams[12].toNumber(),
    //         maxFireDelay: smallShipParams[13].toNumber(),
    //         minCannons: smallShipParams[14].toNumber(),
    //         maxCannons: smallShipParams[15].toNumber(),
    //         minCannonsRange: smallShipParams[16].toNumber(),
    //         maxCannonsRange: smallShipParams[17].toNumber(),
    //         minCannonsDamage: smallShipParams[18].toNumber(),
    //         maxCannonsDamage: smallShipParams[19].toNumber(),
    //         minIntegrity: smallShipParams[20].toNumber(),
    //         maxIntegrity: smallShipParams[21].toNumber()
    //     };

    //     this.middleShipStatsRange = {
    //         minArmor: middleShipParams[0].toNumber(),
    //         maxArmor: middleShipParams[1].toNumber(),
    //         minHull: middleShipParams[2].toNumber(),
    //         maxHull: smallShipParams[3].toNumber(),
    //         minMaxSpeed: middleShipParams[4].toNumber(),
    //         maxMaxSpeed: middleShipParams[5].toNumber(),
    //         minAccelerationStep: middleShipParams[6].toNumber(),
    //         maxAccelerationStep: middleShipParams[7].toNumber(),
    //         minAccelerationDelay: middleShipParams[8].toNumber(),
    //         maxAccelerationDelay: middleShipParams[9].toNumber(),
    //         minRotationDelay: middleShipParams[10].toNumber(),
    //         maxRotationDelay: middleShipParams[11].toNumber(),
    //         minFireDelay: middleShipParams[12].toNumber(),
    //         maxFireDelay: middleShipParams[13].toNumber(),
    //         minCannons: middleShipParams[14].toNumber(),
    //         maxCannons: middleShipParams[15].toNumber(),
    //         minCannonsRange: middleShipParams[16].toNumber(),
    //         maxCannonsRange: middleShipParams[17].toNumber(),
    //         minCannonsDamage: middleShipParams[18].toNumber(),
    //         maxCannonsDamage: middleShipParams[19].toNumber(),
    //         minIntegrity: middleShipParams[20].toNumber(),
    //         maxIntegrity: middleShipParams[21].toNumber()
    //     };
    // }
}