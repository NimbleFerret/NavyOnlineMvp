/* eslint-disable prettier/prettier */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Contract, ethers } from 'ethers';

import * as Captain from '../abi/Captain.json';
import * as Aks from '../abi/Aks.json';
import * as Nvy from '../abi/Nvy.json';
import * as Ship from '../abi/Ship.json';
import * as Island from '../abi/Island.json';
import * as ShipTemplate from '../abi/ShipTemplate.json';
import * as FounderCaptainCollectionSale from '../abi/FounderCaptainCollectionSale.json';
import * as FounderShipCollectionSale from '../abi/FounderShipCollectionSale.json';
import * as FounderIslandCollectionSale from '../abi/FounderIslandCollectionSale.json';
import { NftCaptainGenerator } from 'src/nft/nft.captain.generator';
import { ShipSize } from '../asset/asset.ship.entity';
import { Rarity } from '../random/random.entity';
import { NftIslandGenerator } from '../nft/nft.island.generator';
import { RandomService } from '../random/random.service';
import { AssetService } from 'src/asset/asset.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AppEvents, MintIngameReward } from 'src/app.events';
import { WorldService } from 'src/world/world.service';

// ------------------------------------
// Captain stats
// ------------------------------------

export interface CaptainStats {
    level: number;
    traits: number;
    rarity: number;
    mining: boolean,
    staking: boolean,
    miningRewardNVY: number;
    stakingRewardNVY: number;
    miningStartedAt: number;
    miningDurationSeconds: number;
    miningIsland: number;
}

// ------------------------------------
// Ship stats
// ------------------------------------

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

// ------------------------------------
// Island stats
// ------------------------------------

export interface IslandStats {
    level: number;
    rarity: number;
    mining: boolean;
    terrain: string;
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

// ------------------------------------
// Cache
// ------------------------------------

export interface FounderCollectionsInfo {
    captainsOnSale: string;
    shipsOnSale: string;
    islandsOnSale: string;
}

@Injectable()
export class CronosService implements OnModuleInit {

    private readonly ethersProvider = new ethers.providers.JsonRpcProvider('https://evm-t3.cronos.org');

    private readonly backendWallet = new ethers.Wallet('', this.ethersProvider);

    public static readonly AksContractAddress = '0x50aCa9A511d59D74C4dB8766b64aCa16C9751a43';
    public static readonly NvyContractAddress = '0x7Cd571Bfc68a7c35292fec98D005EecD5767742C';

    public static readonly CaptainContractAddress = '0xaCf10BA05a8B36324E0A083Cf4454359A4644147';
    public static readonly ShipContractAddress = '0x86E391AeCc06f1ccd793c29012fC76D5b4A25A49';
    public static readonly IslandContractAddress = '0x805325D64B9178F85d52aFb51B2A99EC403f447d';

    private readonly ShipTemplateContractAddress = '0x360B728091490f5e21B2f7686630A4888B37BDad';

    private readonly FounderCaptainCollectionSaleContractAddress = '0x3D90B678b3B3f00E883873Dd503287eB2Eb27750';
    private readonly FounderShipCollectionSaleContractAddress = '0x825cD99fAaA4394de728a7B2133857FB8bcc6921';
    private readonly FounderIslandCollectionSaleContractAddress = '0xc9F020cD68DCeB36E4466a5A0aAaED5aEC96FECF';

    private shipStatsStep: ShipStatsStep;
    private smallShipStatsRange: ShipStatsRange;
    private middleShipStatsRange: ShipStatsRange;

    // Token contracts
    private aksContract: Contract;
    private nvyContract: Contract;

    // NFT contracts
    private captainContract: Contract;
    private shipContract: Contract;
    private islandContract: Contract;

    // Sale contracts
    private founderCaptainCollectionSaleContract: Contract;
    private founderShipCollectionSaleContract: Contract;
    private founderIslandCollectionSaleContract: Contract;

    private readonly founderCaptainsOnSaleTotal = 100;
    private readonly founderShipsOnSaleTotal = 500;
    private readonly founderIslandsOnSaleTotal = 42;

    private readonly nftCaptainGenerator: NftCaptainGenerator;
    private readonly nftIslandGenerator: NftIslandGenerator;

    private founderCollectionsInfo: FounderCollectionsInfo;

    constructor(private assetService: AssetService, private worldService: WorldService, private eventEmitter: EventEmitter2) {
        this.nftCaptainGenerator = new NftCaptainGenerator();
        this.nftIslandGenerator = new NftIslandGenerator();

        this.founderCollectionsInfo = {
            captainsOnSale: '-',
            shipsOnSale: '-',
            islandsOnSale: '-',
        }

        setInterval(() => this.updateFounderCollectionsInfo(), 1000 * 60 * 5);
    }

    async onModuleInit() {
        this.aksContract = new ethers.Contract(CronosService.AksContractAddress, Aks, this.ethersProvider).connect(this.backendWallet);
        this.nvyContract = new ethers.Contract(CronosService.NvyContractAddress, Nvy, this.ethersProvider).connect(this.backendWallet);

        this.captainContract = new ethers.Contract(CronosService.CaptainContractAddress, Captain, this.ethersProvider).connect(this.backendWallet);
        this.shipContract = new ethers.Contract(CronosService.ShipContractAddress, Ship, this.ethersProvider).connect(this.backendWallet);
        this.islandContract = new ethers.Contract(CronosService.IslandContractAddress, Island, this.ethersProvider).connect(this.backendWallet);

        const shipTemplateContract = new ethers.Contract(this.ShipTemplateContractAddress, ShipTemplate, this.ethersProvider);

        // --------------------------------
        // NFT events
        // --------------------------------

        this.shipContract.on('ShipRepaired', async (sender: string, shipId: string) => {
            // TODO update ship contract here...
            this.assetService.repairShip(shipId);
        });

        // --------------------------------
        // Founders collection sale events
        // --------------------------------

        this.founderCaptainCollectionSaleContract = new ethers.Contract(this.FounderCaptainCollectionSaleContractAddress, FounderCaptainCollectionSale, this.ethersProvider);
        this.founderShipCollectionSaleContract = new ethers.Contract(this.FounderShipCollectionSaleContractAddress, FounderShipCollectionSale, this.ethersProvider);
        this.founderIslandCollectionSaleContract = new ethers.Contract(this.FounderIslandCollectionSaleContractAddress, FounderIslandCollectionSale, this.ethersProvider);

        this.founderCaptainCollectionSaleContract.on('GenerateCaptain', async (sender: string) => {
            try {
                console.log('Generating a new captain for: ' + sender);

                let captainsOnSale = await this.founderCaptainCollectionSaleContract.captainOnSaleTotal();
                captainsOnSale = captainsOnSale.toNumber();

                const captainStats = {
                    traits: "",
                    rarity: Rarity.LEGENDARY,
                    mining: false,
                    staking: false,
                    miningRewardNVY: 15,
                    stakingRewardNVY: 5,
                    miningStartedAt: 0,
                    miningDurationSeconds: 120,
                    miningIsland: 0
                } as CaptainStats;

                const captainMetadata = await this.nftCaptainGenerator.generateFounderCaptain(
                    captainsOnSale,
                    this.founderCaptainsOnSaleTotal,
                    captainStats
                );

                const tuple: [
                    boolean,
                    boolean,
                    ethers.BigNumber,
                    ethers.BigNumber,
                    ethers.BigNumber,
                    ethers.BigNumber,
                    ethers.BigNumber,
                    ethers.BigNumber,
                    ethers.BigNumber,
                    ethers.BigNumber] = [
                        false,
                        false,
                        ethers.BigNumber.from(0),
                        ethers.BigNumber.from(0),
                        ethers.BigNumber.from(Rarity.LEGENDARY),
                        ethers.BigNumber.from(15),
                        ethers.BigNumber.from(5),
                        ethers.BigNumber.from(0),
                        ethers.BigNumber.from(120),
                        ethers.BigNumber.from(0)
                    ];

                await this.captainContract.grantCaptain(sender, tuple, captainMetadata);

                console.log('Captain for: ' + sender + ' generated !');
            } catch (e) {
                console.error('Unable to generate captain nft !', e);
            }
        });

        this.founderShipCollectionSaleContract.on('GenerateShip', async (sender: string) => {
            try {
                console.log('Generating a new ship for: ' + sender);

                let shipOnSale = await this.founderShipCollectionSaleContract.shipOnSaleTotal();
                shipOnSale = shipOnSale.toNumber();

                const newShipMetadataAndAttrs = await this.assetService.generateShipMetadata(
                    sender,
                    shipOnSale,
                    this.founderShipsOnSaleTotal,
                    this.smallShipStatsRange,
                    this.middleShipStatsRange,
                    this.shipStatsStep,
                    ShipSize.MIDDLE);
                const tuple: [ethers.BigNumber, ethers.BigNumber, ethers.BigNumber] = [ethers.BigNumber.from(newShipMetadataAndAttrs.shipAttributes.maxIntegrity), ethers.BigNumber.from(1), ethers.BigNumber.from(55)];
                await this.shipContract.grantShip(sender, tuple, newShipMetadataAndAttrs.metadata);

                console.log('Ship for: ' + sender + ' generated !');
            } catch (e) {
                console.error('Unable to generate ship nft !', e);
            }
        });

        this.founderIslandCollectionSaleContract.on('GenerateIsland', async (sender: string) => {
            try {
                console.log('Generating a new island for: ' + sender);

                let islandsOnSale = await this.founderIslandCollectionSaleContract.islandOnSaleTotal();
                islandsOnSale = islandsOnSale.toNumber();

                const terrainRnd = RandomService.GetRandomIntInRange(1, 100);
                let terrain = 'Green';
                if (100 - NftIslandGenerator.DarkTerrainChance < terrainRnd) {
                    terrain = 'Dark'
                } else if (100 - NftIslandGenerator.SnowTerrainChance < terrainRnd) {
                    terrain = 'Snow';
                }

                const nextIslandPosition = await this.worldService.generateNewIslandPosition();
                const islandStats = {
                    level: 0,
                    rarity: Rarity.LEGENDARY,
                    mining: false,
                    terrain,
                    miningStartedAt: 0,
                    miningDurationSeconds: 120,
                    miningRewardNVY: 45,
                    shipAndCaptainFee: 10,
                    currMiners: 0,
                    maxMiners: 3,
                    minersFee: 5,
                    x: nextIslandPosition.x,
                    y: nextIslandPosition.y
                } as IslandStats;

                const islandMetadata = await this.nftIslandGenerator.generateFounderIsland(
                    islandsOnSale,
                    this.founderIslandsOnSaleTotal,
                    islandStats
                );

                const tuple: [
                    boolean,
                    ethers.BigNumber,
                    ethers.BigNumber,
                    ethers.BigNumber,
                    ethers.BigNumber,
                    ethers.BigNumber,
                    ethers.BigNumber,
                    ethers.BigNumber] = [
                        false,
                        ethers.BigNumber.from(0),
                        ethers.BigNumber.from(120),
                        ethers.BigNumber.from(45),
                        ethers.BigNumber.from(10),
                        ethers.BigNumber.from(0),
                        ethers.BigNumber.from(3),
                        ethers.BigNumber.from(5)
                    ];

                await this.islandContract.grantIsland(sender, tuple, islandMetadata);

                console.log('Island for: ' + sender + ' generated !');
            } catch (e) {
                console.error('Unable to generate island nft !', e);
            }
        });

        const shipStatsStep = await shipTemplateContract.getShipStatsStep();
        const smallShipParams = await shipTemplateContract.getSmallShipStats();
        const middleShipParams = await shipTemplateContract.getMiddleShipStats();

        this.shipStatsStep = {
            armorAndHullStep: shipStatsStep[0].toNumber(),
            speedAndAccelerationStep: shipStatsStep[1].toNumber(),
            inputDelayStep: shipStatsStep[2].toNumber(),
            cannonsStep: shipStatsStep[3].toNumber(),
            cannonsRangeStep: shipStatsStep[4].toNumber(),
            cannonsDamageStep: shipStatsStep[5].toNumber(),
            integrityStep: shipStatsStep[6].toNumber()
        }

        this.smallShipStatsRange = {
            minArmor: smallShipParams[0].toNumber(),
            maxArmor: smallShipParams[1].toNumber(),
            minHull: smallShipParams[2].toNumber(),
            maxHull: smallShipParams[3].toNumber(),
            minMaxSpeed: smallShipParams[4].toNumber(),
            maxMaxSpeed: smallShipParams[5].toNumber(),
            minAccelerationStep: smallShipParams[6].toNumber(),
            maxAccelerationStep: smallShipParams[7].toNumber(),
            minAccelerationDelay: smallShipParams[8].toNumber(),
            maxAccelerationDelay: smallShipParams[9].toNumber(),
            minRotationDelay: smallShipParams[10].toNumber(),
            maxRotationDelay: smallShipParams[11].toNumber(),
            minFireDelay: smallShipParams[12].toNumber(),
            maxFireDelay: smallShipParams[13].toNumber(),
            minCannons: smallShipParams[14].toNumber(),
            maxCannons: smallShipParams[15].toNumber(),
            minCannonsRange: smallShipParams[16].toNumber(),
            maxCannonsRange: smallShipParams[17].toNumber(),
            minCannonsDamage: smallShipParams[18].toNumber(),
            maxCannonsDamage: smallShipParams[19].toNumber(),
            minIntegrity: smallShipParams[20].toNumber(),
            maxIntegrity: smallShipParams[21].toNumber()
        };

        this.middleShipStatsRange = {
            minArmor: middleShipParams[0].toNumber(),
            maxArmor: middleShipParams[1].toNumber(),
            minHull: middleShipParams[2].toNumber(),
            maxHull: smallShipParams[3].toNumber(),
            minMaxSpeed: middleShipParams[4].toNumber(),
            maxMaxSpeed: middleShipParams[5].toNumber(),
            minAccelerationStep: middleShipParams[6].toNumber(),
            maxAccelerationStep: middleShipParams[7].toNumber(),
            minAccelerationDelay: middleShipParams[8].toNumber(),
            maxAccelerationDelay: middleShipParams[9].toNumber(),
            minRotationDelay: middleShipParams[10].toNumber(),
            maxRotationDelay: middleShipParams[11].toNumber(),
            minFireDelay: middleShipParams[12].toNumber(),
            maxFireDelay: middleShipParams[13].toNumber(),
            minCannons: middleShipParams[14].toNumber(),
            maxCannons: middleShipParams[15].toNumber(),
            minCannonsRange: middleShipParams[16].toNumber(),
            maxCannonsRange: middleShipParams[17].toNumber(),
            minCannonsDamage: middleShipParams[18].toNumber(),
            maxCannonsDamage: middleShipParams[19].toNumber(),
            minIntegrity: middleShipParams[20].toNumber(),
            maxIntegrity: middleShipParams[21].toNumber()
        };

        // Fill cache
        this.updateFounderCollectionsInfo();

        console.log('started');
    }

    async rewardNVY(amount: number, recipient: string) {
        try {
            Logger.log('Minting ' + amount + ' NVY for ' + recipient);
            await this.nvyContract.mintReward(recipient, ethers.BigNumber.from(amount));
        } catch (e) {
            Logger.error('Unable to mint ' + amount + ' NVY for ' + recipient);
        }
    }

    async rewardAKS(amount: number, recipient: string) {
        try {
            Logger.log('Minting ' + amount + ' AKS for ' + recipient);
            await this.aksContract.mintReward(recipient, ethers.BigNumber.from(amount));
        } catch (e) {
            Logger.error('Unable to mint ' + amount + ' AKS for ' + recipient);
        }
    }

    async getFounderCollectionsInfo() {
        return this.founderCollectionsInfo;
    }

    private async updateFounderCollectionsInfo() {
        let captainsOnSale = await this.founderCaptainCollectionSaleContract.captainOnSaleTotal();
        captainsOnSale = captainsOnSale.toNumber();
        let shipsOnSale = await this.founderShipCollectionSaleContract.shipOnSaleTotal();
        shipsOnSale = shipsOnSale.toNumber();
        let islandsOnSale = await this.founderIslandCollectionSaleContract.islandOnSaleTotal();
        islandsOnSale = islandsOnSale.toNumber();

        this.founderCollectionsInfo.captainsOnSale = captainsOnSale;
        this.founderCollectionsInfo.shipsOnSale = shipsOnSale;
        this.founderCollectionsInfo.islandsOnSale = islandsOnSale;
    }

    // Events handling

    @OnEvent(AppEvents.MintIngameReward)
    async playerKilledPlayer(data: MintIngameReward) {
        try {
            console.log(`Mint ${data.nvy} NVY and ${data.aks} AKS to player ${data.playerId}`);
            if (data.nvy > 0) {
                await this.nvyContract.mintRewardIngame(data.playerId, ethers.BigNumber.from(data.nvy));
            }
            if (data.aks > 0) {
                await this.aksContract.mintReward(data.playerId, ethers.BigNumber.from(data.aks));
            }
        } catch (e) {
            console.log(`Error during reward mint for player ${data.playerId}`, e);
        }
    }

    // TODO damage ship event

}
