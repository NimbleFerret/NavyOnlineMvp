import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { ClientGrpc } from "@nestjs/microservices";
import { Queue } from "bull";
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { CaptainStats, IslandStats, ShipStatsRange, ShipStatsStep } from "../blockchain/blockchain.service";
import { NftCaptainGenerator } from "./nft.generator.captain";
import { NftIslandGenerator } from "./nft.generator.island";
import { NftShipGenerator } from "./nft.generator.ship";
import { TransactionType } from "../blockchain/schemas/schema.blockchain.transaction";
import { BlockchainQueueProcessor, NFTJobData } from "../blockchain/blockchain.queue.processor";
import { SharedLibraryService } from "@app/shared-library";
import { Rarity, ShipSize, Terrain } from "@app/shared-library/shared-library.main";
import { ShipEntity } from "@app/shared-library/entities/entity.ship";
import { IslandPositionResponse, WorldService, WorldServiceGrpcClientName, WorldServiceName } from "@app/shared-library/gprc/grpc.world.service";
import { Constants } from "../app.constants";

@Injectable()
export class NFTService implements OnModuleInit {

    private readonly logger = new Logger(NFTService.name);

    private nftCaptainGenerator = new NftCaptainGenerator();
    private nftShipGenerator = new NftShipGenerator();
    private nftIslandGenerator = new NftIslandGenerator();

    private smallShipStatsRange: ShipStatsRange;
    private middleShipStatsRange: ShipStatsRange;
    private shipStatsStep: ShipStatsStep;

    private worldService: WorldService;

    constructor(
        @Inject(WorldServiceGrpcClientName) private readonly worldServiceGrpcClient: ClientGrpc,
        @InjectQueue('blockchain') private readonly blockchainQueue: Queue) { }

    async onModuleInit() {
        this.worldService = this.worldServiceGrpcClient.getService<WorldService>(WorldServiceName);
    }

    updateShipStats(smallShipStatsRange: ShipStatsRange, middleShipStatsRange: ShipStatsRange, shipStatsStep: ShipStatsStep) {
        this.smallShipStatsRange = smallShipStatsRange;
        this.middleShipStatsRange = middleShipStatsRange;
        this.shipStatsStep = shipStatsStep;
    }

    // TODO use this
    async createNewCaptain(index: number, maxIndex: number, recipient: string) {
        // try {
        //     const captainStats = {
        //         level: 0,
        //         traits: 0,
        //         rarity: Rarity.LEGENDARY,
        //         mining: false,
        //         staking: false,
        //         miningRewardNVY: 15,
        //         stakingRewardNVY: 5,
        //         miningStartedAt: 0,
        //         miningDurationSeconds: 120,
        //         miningIsland: 0
        //     } as CaptainStats;

        //     const metadata = await this.nftCaptainGenerator.generateFounderCaptain(index, maxIndex, captainStats)

        //     const tuple: [
        //         boolean,
        //         boolean,
        //         ethers.BigNumber,
        //         ethers.BigNumber,
        //         ethers.BigNumber,
        //         ethers.BigNumber,
        //         ethers.BigNumber,
        //         ethers.BigNumber,
        //         ethers.BigNumber,
        //         ethers.BigNumber] = [
        //             false,
        //             false,
        //             ethers.BigNumber.from(0),
        //             ethers.BigNumber.from(0),
        //             ethers.BigNumber.from(Rarity.LEGENDARY),
        //             ethers.BigNumber.from(captainStats.miningRewardNVY),
        //             ethers.BigNumber.from(captainStats.stakingRewardNVY),
        //             ethers.BigNumber.from(captainStats.miningStartedAt),
        //             ethers.BigNumber.from(captainStats.miningDurationSeconds),
        //             ethers.BigNumber.from(captainStats.miningIsland)
        //         ];

        //     await this.blockchainQueue.add(BlockchainQueueProcessor.MINT_NFT_QUEUE, {
        //         id: uuidv4(),
        //         transactionType: TransactionType.MINT_FOUNDERS_CAPTAIN,
        //         recipient,
        //         tuple,
        //         metadata
        //     } as NFTJobData);
        // } catch (e) {
        //     this.logger.error(`createNewCaptain for: ${recipient}, error`, e);
        // }
    }

    async createNewShip(index: number, maxIndex: number, recipient: string, preferredSize?: ShipSize) {
        // try {
        //     const shipAttributes = this.generateShipAttributes(preferredSize);
        //     shipAttributes.id = String(index);
        //     shipAttributes.owner = recipient;

        //     const metadata = await this.nftShipGenerator.generateFounderShip(index, maxIndex, shipAttributes);

        //     const tuple: [ethers.BigNumber, ethers.BigNumber, ethers.BigNumber] =
        //         [
        //             ethers.BigNumber.from(shipAttributes.maxIntegrity),
        //             ethers.BigNumber.from(1),
        //             ethers.BigNumber.from(55)
        //         ];

        //     await this.blockchainQueue.add(BlockchainQueueProcessor.MINT_NFT_QUEUE, {
        //         id: uuidv4(),
        //         transactionType: TransactionType.MINT_FOUNDERS_SHIP,
        //         recipient,
        //         tuple,
        //         metadata
        //     } as NFTJobData);
        // } catch (e) {
        //     this.logger.error(`createNewShip for: ${recipient}, error`, e);
        // }
    }

    async createNewIsland(index: number, maxIndex: number, recipient: string) {
        // try {
        //     const terrainRnd = SharedLibraryService.GetRandomIntInRange(1, 100);
        //     let terrain = Terrain.GREEN;
        //     if (100 - NftIslandGenerator.DarkTerrainChance < terrainRnd) {
        //         terrain = Terrain.DARK
        //     } else if (100 - NftIslandGenerator.SnowTerrainChance < terrainRnd) {
        //         terrain = Terrain.SNOW;
        //     }

        //     this.worldService.GenerateNewIslandPosition({}).subscribe({
        //         next: (response: IslandPositionResponse) => async () => {
        //             if (response.success) {
        //                 const islandStats = {
        //                     level: 0,
        //                     rarity: Rarity.LEGENDARY,
        //                     mining: false,
        //                     terrain,
        //                     miningStartedAt: 0,
        //                     miningDurationSeconds: 120,
        //                     miningRewardNVY: 45,
        //                     shipAndCaptainFee: 10,
        //                     currMiners: 0,
        //                     maxMiners: 3,
        //                     minersFee: 5,
        //                     x: response.x,
        //                     y: response.y
        //                 } as IslandStats;

        //                 const metadata = await this.nftIslandGenerator.generateFounderIsland(index, maxIndex, islandStats);

        //                 const tuple: [
        //                     boolean,
        //                     ethers.BigNumber,
        //                     ethers.BigNumber,
        //                     ethers.BigNumber,
        //                     ethers.BigNumber,
        //                     ethers.BigNumber,
        //                     ethers.BigNumber,
        //                     ethers.BigNumber] = [
        //                         false,
        //                         ethers.BigNumber.from(islandStats.miningStartedAt),
        //                         ethers.BigNumber.from(islandStats.miningDurationSeconds),
        //                         ethers.BigNumber.from(islandStats.miningRewardNVY),
        //                         ethers.BigNumber.from(islandStats.shipAndCaptainFee),
        //                         ethers.BigNumber.from(islandStats.currMiners),
        //                         ethers.BigNumber.from(islandStats.maxMiners),
        //                         ethers.BigNumber.from(islandStats.minersFee)
        //                     ];

        //                 await this.blockchainQueue.add(BlockchainQueueProcessor.MINT_NFT_QUEUE, {
        //                     id: uuidv4(),
        //                     transactionType: TransactionType.MINT_FOUNDERS_ISLAND,
        //                     recipient,
        //                     tuple,
        //                     metadata
        //                 } as NFTJobData);
        //             }
        //         },
        //         error: (e) => this.logger.error(`Cant get new island position`, e)
        //     });
        // } catch (e) {
        //     this.logger.error(`createNewIsland for: ${recipient}, error`, e);
        // }
    }

    // ---------------------------------
    // Ship attributes random generation
    // ---------------------------------

    private generateShipAttributes(preferredSize?: ShipSize) {
        const size = this.generateShipSize(preferredSize);
        const shipStatsRange = size == ShipSize.MIDDLE ? this.middleShipStatsRange : this.smallShipStatsRange;
        const cannons = this.generateShipGuns(3, 4, 10);
        return {
            hull: this.calculateShipAttribute(shipStatsRange.minHull, shipStatsRange.maxHull, this.shipStatsStep.armorAndHullStep),
            armor: this.calculateShipAttribute(shipStatsRange.minArmor, shipStatsRange.maxArmor, this.shipStatsStep.armorAndHullStep),
            maxSpeed: this.calculateShipAttribute(shipStatsRange.minMaxSpeed, shipStatsRange.maxMaxSpeed, this.shipStatsStep.speedAndAccelerationStep),
            accelerationStep: this.calculateShipAttribute(shipStatsRange.minAccelerationStep, shipStatsRange.maxAccelerationStep, this.shipStatsStep.speedAndAccelerationStep),
            accelerationDelay: this.calculateShipAttribute(shipStatsRange.minAccelerationDelay, shipStatsRange.maxAccelerationDelay, this.shipStatsStep.inputDelayStep),
            rotationDelay: this.calculateShipAttribute(shipStatsRange.minRotationDelay, shipStatsRange.maxRotationDelay, this.shipStatsStep.inputDelayStep),
            fireDelay: this.calculateShipAttribute(shipStatsRange.minFireDelay, shipStatsRange.maxFireDelay, this.shipStatsStep.inputDelayStep),
            cannons,
            cannonsRange: this.calculateShipAttribute(shipStatsRange.minCannonsRange, shipStatsRange.maxCannonsRange, this.shipStatsStep.cannonsRangeStep),
            cannonsDamage: this.calculateShipAttribute(shipStatsRange.minCannonsDamage, shipStatsRange.maxCannonsDamage, this.shipStatsStep.cannonsDamageStep),
            currentIntegrity: this.calculateShipAttribute(shipStatsRange.minIntegrity, shipStatsRange.maxIntegrity, this.shipStatsStep.integrityStep),
            maxIntegrity: this.calculateShipAttribute(shipStatsRange.minIntegrity, shipStatsRange.maxIntegrity, this.shipStatsStep.integrityStep),
            level: 0,
            traits: 0,
            rarity: Rarity.LEGENDARY,
            size
        } as ShipEntity;
    }

    private generateShipSize(preferredSize?: ShipSize) {
        if (!preferredSize) {
            const rnd = SharedLibraryService.GetRandomIntInRange(1, 100);
            if (rnd > Constants.ShipMiddleChance) {
                return ShipSize.SMALL;
            } else {
                return ShipSize.MIDDLE;
            }
        }
        return preferredSize;
    }

    private generateShipGuns(minGuns: number, maxGuns: number, additionalGunChance: number) {
        let shipGuns = minGuns;
        for (let i = 0; i < maxGuns + minGuns; i++) {
            const rnd = SharedLibraryService.GetRandomIntInRange(1, 100);
            if (additionalGunChance >= rnd) {
                shipGuns++;
            }
        }

        return shipGuns;
    }

    private calculateShipAttribute(minAttribute: number, maxAttribute: number, stepAttribute: number) {
        const diff = maxAttribute - minAttribute;
        const step = diff / stepAttribute;
        const rnd = SharedLibraryService.GetRandomIntInRange(0, step);
        return minAttribute + (stepAttribute * rnd);
    }
}