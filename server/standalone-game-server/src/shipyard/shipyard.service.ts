/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rarity } from 'src/random/random.entity';
import { RandomService } from 'src/random/random.service';
import { Shipyard, ShipyardDocument } from './shipyard.entity';
import { Ship, ShipDocument, ShipSize } from './shipyard.ship.entity';
import { ShipStats, ShipStatsRange, ShipStatsStep } from 'src/cronos/cronos.service';
import { NftShipGenerator } from 'src/nft/nft.ship.generator';

@Injectable()
export class ShipyardService implements OnModuleInit {

    private shipyard: Shipyard;
    private nftShipGenerator: NftShipGenerator;

    constructor(
        private randomService: RandomService,
        @InjectModel(Ship.name) private shipModel: Model<ShipDocument>,
        @InjectModel(Shipyard.name) private shipyardModel: Model<ShipyardDocument>) {
        this.nftShipGenerator = new NftShipGenerator();
    }

    async onModuleInit() {
        const shipyard = await this.shipyardModel.findOne();
        if (!shipyard) {
            const newShipyard = new this.shipyardModel();
            await newShipyard.save();
            this.shipyard = newShipyard;
        } else {
            this.shipyard = shipyard;
        }
    }

    async generateShip(
        shipCurrentIndex: number,
        shipMaxIndex: number,
        smallShipStatsRange: ShipStatsRange,
        middleShipStatsRange: ShipStatsRange,
        shipStatsStep: ShipStatsStep,
        preferredSize?: ShipSize) {
        const shipAttributes = await this.generateShipAttributes(smallShipStatsRange, middleShipStatsRange, shipStatsStep, preferredSize);
        const shipMetadata = await this.nftShipGenerator.generateFounderShip(shipCurrentIndex, shipMaxIndex, shipAttributes);
        return {
            shipAttributes,
            shipMetadata
        }
    }

    private async generateShipAttributes(smallShipStatsRange: ShipStatsRange, middleShipStatsRange: ShipStatsRange, shipStatsStep: ShipStatsStep, preferredSize?: ShipSize) {
        const size = this.randomService.generateShipSize(preferredSize);
        const shipStatsRange = size == ShipSize.MIDDLE ? middleShipStatsRange : smallShipStatsRange;
        // TODO refactor additional gun chance, move it into the contract ?
        const cannons = this.randomService.generateShipGuns(3, 4, 10);
        // const cannons = this.randomService.generateShipGuns(shipStatsRange.minCannons, shipStatsRange.maxCannons, 10);
        return {
            hull: this.calculateShipAttribute(shipStatsRange.minHull, shipStatsRange.maxHull, shipStatsStep.armorAndHullStep),
            armor: this.calculateShipAttribute(shipStatsRange.minArmor, shipStatsRange.maxArmor, shipStatsStep.armorAndHullStep),
            maxSpeed: this.calculateShipAttribute(shipStatsRange.minMaxSpeed, shipStatsRange.maxMaxSpeed, shipStatsStep.speedAndAccelerationStep),
            accelerationStep: this.calculateShipAttribute(shipStatsRange.minAccelerationStep, shipStatsRange.maxAccelerationStep, shipStatsStep.speedAndAccelerationStep),
            accelerationDelay: this.calculateShipAttribute(shipStatsRange.minAccelerationDelay, shipStatsRange.maxAccelerationDelay, shipStatsStep.inputdelayStep),
            rotationDelay: this.calculateShipAttribute(shipStatsRange.minRotationDelay, shipStatsRange.maxRotationDelay, shipStatsStep.inputdelayStep),
            cannons,
            cannonsRange: this.calculateShipAttribute(shipStatsRange.minCannonsRange, shipStatsRange.maxCannonsRange, shipStatsStep.cannonsRangeStep),
            cannonsDamage: this.calculateShipAttribute(shipStatsRange.minCannonsDamage, shipStatsRange.maxCannonsDamage, shipStatsStep.cannonsDamageStep),
            level: 0,
            traits: 0,
            rarity: Rarity.LEGENDARY,
            size
        } as ShipStats;
    }

    private calculateShipAttribute(minAttribute: number, maxAttribute: number, stepAttribute: number) {
        const diff = maxAttribute - minAttribute;
        const step = diff / stepAttribute;
        const rnd = RandomService.GetRandomIntInRange(0, step);
        return minAttribute + (stepAttribute * rnd);
    }
}
