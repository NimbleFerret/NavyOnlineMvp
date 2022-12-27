import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { v4 as uuidv4 } from 'uuid';
import { EthersProvider } from './blockchain.ethers.provider';

// -----------------------------------------
// These stats are used to generate new NFTs
// -----------------------------------------

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

    private shipStatsStep: ShipStatsStep;
    private smallShipStatsRange: ShipStatsRange;
    private middleShipStatsRange: ShipStatsRange;

    constructor(
        private readonly ethersProvider: EthersProvider,
        @InjectQueue('blockchain') private readonly blockchainQueue: Queue) { }

    async onModuleInit() {
        this.ethersProvider.captainCollectionSaleContract.on(EthersProvider.EventGenerateCaptain, async (sender: string) => {
            try {
            } catch (e) {
            }
        });

        this.ethersProvider.shipCollectionSaleContract.on(EthersProvider.EventGenerateShip, async (sender: string) => {
            try {
            } catch (e) {
            }
        });

        this.ethersProvider.islandCollectionSaleContract.on(EthersProvider.EventGenerateIsland, async (sender: string) => {
            try {
            } catch (e) {
            }
        });
    }

    private async updateAndSetShipStats() {
        const shipStatsStep = await this.ethersProvider.shipTemplateContract.getShipStatsStep();
        const smallShipParams = await this.ethersProvider.shipTemplateContract.getSmallShipStats();
        const middleShipParams = await this.ethersProvider.shipTemplateContract.getMiddleShipStats();

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
    }
}