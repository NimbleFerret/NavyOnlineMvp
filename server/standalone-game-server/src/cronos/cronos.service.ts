/* eslint-disable prettier/prettier */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';

import * as Ship from '../abi/Ship.json';
import * as ShipTemplate from '../abi/ShipTemplate.json';
import * as FounderShipCollectionSale from '../abi/FounderShipCollectionSale.json';
import { ShipyardService } from 'src/shipyard/shipyard.service';

export interface ShipStats {
    armor: number;
    hull: number;
    maxSpeed: number;
    accelerationStep: number;
    accelerationDelay: number;
    rotationDelay: number;
    cannons: number;
    cannonsRange: number;
    cannonsDamage: number;
    level: number;
    traits: number;
    size: number;
    rarity: number;
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
    minCannons: number;
    maxCannons: number;
    minCannonsRange: number;
    maxCannonsRange: number;
    minCannonsDamage: number;
    maxCannonsDamage: number;
}

export interface ShipStatsStep {
    armorAndHullStep: number;
    speedAndAccelerationStep: number;
    inputdelayStep: number;
    cannonsStep: number;
    cannonsRangeStep: number;
    cannonsDamageStep: number;
}

@Injectable()
export class CronosService implements OnModuleInit {

    private readonly ethersProvider = new ethers.providers.JsonRpcProvider('https://evm-t3.cronos.org');

    // 
    private readonly backendWallet = new ethers.Wallet('', this.ethersProvider);
    private readonly ShipContractAddress = '';
    private readonly ShipTemplateContractAddress = '';
    private readonly FounderShipCollectionSaleContractAddress = '';

    private shipStatsStep: ShipStatsStep;
    private smallShipStatsRange: ShipStatsRange;
    private middleShipStatsRange: ShipStatsRange;

    constructor(private shipyardService: ShipyardService) {
    }

    async onModuleInit() {
        const shipContract = new ethers.Contract(this.ShipContractAddress, Ship, this.ethersProvider).connect(this.backendWallet);
        const shipTemplateContract = new ethers.Contract(this.ShipTemplateContractAddress, ShipTemplate, this.ethersProvider);
        const founderShipCollectionSaleContract = new ethers.Contract(this.FounderShipCollectionSaleContractAddress, FounderShipCollectionSale, this.ethersProvider);

        // TODO implement not fulfilled requests
        founderShipCollectionSaleContract.on('GenerateShip', async (sender: string) => {
            try {
                Logger.log('Generating a new ship for: ' + sender);

                const founderShipsTotal = 500;
                let shipOnSale = await founderShipCollectionSaleContract.getShipsOnSale();
                shipOnSale = shipOnSale.toNumber();

                const generatedShip = await this.shipyardService.generateShip(
                    shipOnSale,
                    founderShipsTotal,
                    this.smallShipStatsRange,
                    this.middleShipStatsRange,
                    this.shipStatsStep);
                await shipContract.grantNFT(sender, generatedShip.shipAttributes, generatedShip.shipMetadata);

            } catch (e) {
                Logger.error('Unable to generate ship nft !', e);
            }
        });

        // TODO store each ships params
        const shipStatsStep = await shipTemplateContract.getShipStatsStep();
        const smallShipParams = await shipTemplateContract.getSmallShipStats();
        const middleShipParams = await shipTemplateContract.getMiddleShipStats();

        this.shipStatsStep = {
            armorAndHullStep: shipStatsStep[0].toNumber(),
            speedAndAccelerationStep: shipStatsStep[1].toNumber(),
            inputdelayStep: shipStatsStep[2].toNumber(),
            cannonsStep: shipStatsStep[3].toNumber(),
            cannonsRangeStep: shipStatsStep[4].toNumber(),
            cannonsDamageStep: shipStatsStep[5].toNumber()
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
            minCannons: smallShipParams[12].toNumber(),
            maxCannons: smallShipParams[13].toNumber(),
            minCannonsRange: smallShipParams[14].toNumber(),
            maxCannonsRange: smallShipParams[15].toNumber(),
            minCannonsDamage: smallShipParams[16].toNumber(),
            maxCannonsDamage: smallShipParams[17].toNumber()
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
            minCannons: middleShipParams[12].toNumber(),
            maxCannons: middleShipParams[13].toNumber(),
            minCannonsRange: middleShipParams[14].toNumber(),
            maxCannonsRange: middleShipParams[15].toNumber(),
            minCannonsDamage: middleShipParams[16].toNumber(),
            maxCannonsDamage: middleShipParams[17].toNumber()
        };
    }

}
