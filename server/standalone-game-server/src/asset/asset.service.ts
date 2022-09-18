/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Captain, CaptainDocument, PlayerCaptainEntity } from './asset.captain.entity';
import { Island, IslandDocument } from './asset.island.entity';
import { PlayerShipEntity, Ship, ShipDocument, ShipSize } from './asset.ship.entity';
import { ShipStatsRange, ShipStatsStep } from '../cronos/cronos.service';
import { Rarity } from '../random/random.entity';
import { RandomService } from '../random/random.service';
import { NftShipGenerator } from '../nft/nft.ship.generator';

export enum AssetType {
    FREE = 1,
    COMMON = 2
}

@Injectable()
export class AssetService implements OnModuleInit {

    private nftShipGenerator = new NftShipGenerator()

    constructor(
        private randomService: RandomService,
        @InjectModel(Captain.name) private captainModel: Model<CaptainDocument>,
        @InjectModel(Ship.name) private shipModel: Model<ShipDocument>,
        @InjectModel(Island.name) private islandModel: Model<IslandDocument>,
    ) {
    }

    async onModuleInit() {
        const captain = await this.captainModel.findOne();
        const ship = await this.shipModel.findOne();
        if (!captain && !ship) {
            await this.generateFreeCaptain();
            await this.generateFreeShip();
        }
    }

    // Captain

    async syncCaptainIfNeeded(playerCaptainEntity: PlayerCaptainEntity) {
        let captain = await this.captainModel.findOne({
            tokenId: playerCaptainEntity.id
        });
        // Save captain if not exists
        if (!captain) {
            captain = await this.saveNewCaptain(AssetType.COMMON, playerCaptainEntity);
        } else {
            // Update captain stats
            captain.owner = playerCaptainEntity.owner;
            captain.miningRewardNVY = playerCaptainEntity.miningRewardNVY;
            captain.stakingRewardNVY = playerCaptainEntity.stakingRewardNVY;
            captain.traits = playerCaptainEntity.traits;
            captain.level = playerCaptainEntity.level;
            captain = await captain.save();
        }
        return captain;
    }

    async generateFreeCaptain() {
        return await this.saveNewCaptain(AssetType.FREE, {
            id: 'free',
            owner: '',
            miningRewardNVY: 0,
            stakingRewardNVY: 0,
            miningStartedAt: 0,
            miningDurationSeconds: 0,
            traits: 0,
            level: 0,
            bg: 1,
            acc: 0,
            head: 3,
            haircutOrHat: 3,
            clothes: 3,
            rarity: Rarity.COMMON,
        } as PlayerCaptainEntity);
    }

    private async saveNewCaptain(assetType: AssetType, captainEntity: PlayerCaptainEntity) {
        const newCaptain = new this.captainModel();

        newCaptain.tokenId = captainEntity.id;
        newCaptain.owner = captainEntity.owner;
        newCaptain.miningRewardNVY = captainEntity.miningRewardNVY;
        newCaptain.stakingRewardNVY = captainEntity.stakingRewardNVY;
        newCaptain.traits = captainEntity.traits;
        newCaptain.level = captainEntity.level;
        newCaptain.type = assetType;
        newCaptain.rarity = captainEntity.rarity;
        newCaptain.bg = captainEntity.bg;
        newCaptain.acc = captainEntity.acc;
        newCaptain.head = captainEntity.head;
        newCaptain.haircutOrHat = captainEntity.haircutOrHat;
        newCaptain.clothes = captainEntity.clothes;

        return await newCaptain.save();
    }

    // Ship

    async syncShipIfNeeded(playerShipEntity: PlayerShipEntity) {
        let ship = await this.shipModel.findOne({
            tokenId: playerShipEntity.id
        });
        // Save ship if not exists
        if (!ship) {
            // Qfix
            if (playerShipEntity.size == 1) {
                playerShipEntity.size = 2;
            }
            // Qfix 2
            playerShipEntity.fireDelay = 300;
            playerShipEntity.currentIntegrity = 10;
            playerShipEntity.maxIntegrity = 10;
            ship = await this.saveNewShip(AssetType.COMMON, playerShipEntity);
        } else {
            // Update ship stats
            ship.hull = playerShipEntity.hull;
            ship.owner = playerShipEntity.owner;
            ship.armor = playerShipEntity.armor;
            ship.maxSpeed = playerShipEntity.maxSpeed;
            ship.accelerationStep = playerShipEntity.accelerationStep;
            ship.accelerationDelay = playerShipEntity.accelerationDelay;
            ship.rotationDelay = playerShipEntity.rotationDelay;
            ship.cannons = playerShipEntity.cannons;
            ship.cannonsRange = playerShipEntity.cannonsRange;
            ship.cannonsDamage = playerShipEntity.cannonsDamage;
            ship.traits = playerShipEntity.traits;
            ship.level = playerShipEntity.level;
            ship = await ship.save();
        }
        return ship;
    }

    async generateFreeShip() {
        return await this.saveNewShip(AssetType.FREE, {
            id: 'free',
            owner: '',
            armor: 300,
            hull: 300,
            maxSpeed: 150,
            accelerationStep: 50,
            accelerationDelay: 200,
            rotationDelay: 200,
            fireDelay: 500,
            cannons: 2,
            cannonsRange: 500,
            cannonsDamage: 20,
            level: 0,
            traits: 0,
            size: ShipSize.SMALL,
            rarity: Rarity.COMMON,
            windows: 0,
            anchor: 0,
            currentIntegrity: 0,
            maxIntegrity: 0
        } as PlayerShipEntity);
    }

    async generateShipMetadata(
        owner: string,
        shipCurrentIndex: number,
        shipMaxIndex: number,
        smallShipStatsRange: ShipStatsRange,
        middleShipStatsRange: ShipStatsRange,
        shipStatsStep: ShipStatsStep,
        preferredSize?: ShipSize
    ) {
        const shipAttributes = await this.generateShipAttributes(smallShipStatsRange, middleShipStatsRange, shipStatsStep, preferredSize);
        shipAttributes.id = shipCurrentIndex.toString();
        shipAttributes.owner = owner;

        await this.saveNewShip(AssetType.COMMON, shipAttributes);

        return await this.nftShipGenerator.generateFounderShip(shipCurrentIndex, shipMaxIndex, shipAttributes);
    }

    async getFreeCaptain() {
        return this.captainModel.findOne({ tokenId: 'free' });
    }

    async getFreeShip() {
        return this.shipModel.findOne({ tokenId: 'free' });
    }

    private async saveNewShip(assetType: AssetType, shipEntity: PlayerShipEntity) {
        const newShip = new this.shipModel();

        newShip.tokenId = shipEntity.id;
        newShip.owner = shipEntity.owner;
        newShip.hull = shipEntity.hull;
        newShip.armor = shipEntity.armor;
        newShip.maxSpeed = shipEntity.maxSpeed;
        newShip.accelerationStep = shipEntity.accelerationStep;
        newShip.accelerationDelay = shipEntity.accelerationDelay;
        newShip.rotationDelay = shipEntity.rotationDelay;
        newShip.fireDelay = shipEntity.fireDelay;
        newShip.cannons = shipEntity.cannons;
        newShip.cannonsRange = shipEntity.cannonsRange;
        newShip.cannonsDamage = shipEntity.cannonsDamage;
        newShip.rarity = shipEntity.rarity;
        newShip.size = shipEntity.size;
        newShip.type = assetType;
        newShip.level = shipEntity.level;
        newShip.windows = shipEntity.windows;
        newShip.anchor = shipEntity.anchor;
        newShip.currentIntegrity = shipEntity.currentIntegrity;
        newShip.maxIntegrity = shipEntity.maxIntegrity;

        return await newShip.save();
    }

    private async generateShipAttributes(smallShipStatsRange: ShipStatsRange, middleShipStatsRange: ShipStatsRange, shipStatsStep: ShipStatsStep, preferredSize?: ShipSize) {
        const size = this.randomService.generateShipSize(preferredSize);
        const shipStatsRange = size == ShipSize.MIDDLE ? middleShipStatsRange : smallShipStatsRange;
        const cannons = this.randomService.generateShipGuns(3, 4, 10);
        return {
            hull: this.calculateShipAttribute(shipStatsRange.minHull, shipStatsRange.maxHull, shipStatsStep.armorAndHullStep),
            armor: this.calculateShipAttribute(shipStatsRange.minArmor, shipStatsRange.maxArmor, shipStatsStep.armorAndHullStep),
            maxSpeed: this.calculateShipAttribute(shipStatsRange.minMaxSpeed, shipStatsRange.maxMaxSpeed, shipStatsStep.speedAndAccelerationStep),
            accelerationStep: this.calculateShipAttribute(shipStatsRange.minAccelerationStep, shipStatsRange.maxAccelerationStep, shipStatsStep.speedAndAccelerationStep),
            accelerationDelay: this.calculateShipAttribute(shipStatsRange.minAccelerationDelay, shipStatsRange.maxAccelerationDelay, shipStatsStep.inputdelayStep),
            rotationDelay: this.calculateShipAttribute(shipStatsRange.minRotationDelay, shipStatsRange.maxRotationDelay, shipStatsStep.inputdelayStep),
            fireDelay: this.calculateShipAttribute(shipStatsRange.minFireDelay, shipStatsRange.maxFireDelay, shipStatsStep.inputdelayStep),
            cannons,
            cannonsRange: this.calculateShipAttribute(shipStatsRange.minCannonsRange, shipStatsRange.maxCannonsRange, shipStatsStep.cannonsRangeStep),
            cannonsDamage: this.calculateShipAttribute(shipStatsRange.minCannonsDamage, shipStatsRange.maxCannonsDamage, shipStatsStep.cannonsDamageStep),
            level: 0,
            traits: 0,
            rarity: Rarity.LEGENDARY,
            size
        } as PlayerShipEntity;
    }

    private calculateShipAttribute(minAttribute: number, maxAttribute: number, stepAttribute: number) {
        const diff = maxAttribute - minAttribute;
        const step = diff / stepAttribute;
        const rnd = RandomService.GetRandomIntInRange(0, step);
        return minAttribute + (stepAttribute * rnd);
    }

    // Island

    public async findIslandByXAndY(x: number, y: number) {
        return this.islandModel.findOne({
            x, y
        });
    }

    public async createIsland(tokenId: string, rarity: Rarity, owner: string, x: number, y: number, terrain: string, isBase = false) {
        const island = new this.islandModel();
        island.tokenId = tokenId;
        island.owner = owner;
        island.x = x;
        island.y = y;
        island.isBase = isBase;
        island.terrain = terrain;
        island.rarity = rarity;
        island.mining = false;
        island.miningStartedAt = 0;
        island.miningDurationSeconds = 120;
        island.miningRewardNVY = 45;
        island.shipAndCaptainFee = 10;
        island.minersFee = 5;
        island.miners = 0;
        island.maxMiners = 3;
        return await island.save();
    }

}
