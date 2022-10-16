import Moralis from "moralis";
import { EvmChain } from '@moralisweb3/evm-utils';
import { ethers } from 'ethers';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Constants } from "../app.constants";
import { CaptainEntity } from "@app/shared-library/entities/entity.captain";
import { IslandEntity } from "@app/shared-library/entities/entity.island";
import { ShipEntity } from "@app/shared-library/entities/entity.ship";
import { AssetType } from "@app/shared-library/shared-library.main";
import { GetUserAssetsResponse } from "@app/shared-library/gprc/grpc.web3.service";
import { Ship, ShipDocument } from "@app/shared-library/schemas/schema.ship";
import { Captain, CaptainDocument } from "@app/shared-library/schemas/schema.captain";
import { Island, IslandDocument } from "@app/shared-library/schemas/schema.island";

@Injectable()
export class MoralisService implements OnModuleInit {

    private readonly chain = EvmChain.CRONOS_TESTNET;
    private readonly apiKey = "aQrAItXuznpPv1pEXAgPIIwcVqwaehaPHpB9WmGo0eP1dGUdmzyt5SYfmstQslBF";

    constructor(
        @InjectModel(Captain.name) private captainModel: Model<CaptainDocument>,
        @InjectModel(Ship.name) private shipModel: Model<ShipDocument>,
        @InjectModel(Island.name) private islandModel: Model<IslandDocument>
    ) {

    }

    async onModuleInit() {
        await Moralis.start({
            apiKey: this.apiKey
        });
    }

    public static async UploadFile(path: string, content: string) {
        const abi = [
            {
                path,
                content
            }
        ];
        return await Moralis.EvmApi.ipfs.uploadFolder({
            abi
        });
    }

    async getUserAssets(address: string) {
        const result: GetUserAssetsResponse = {};

        const userAssets = await Promise.all([this.getUserTokenBalances(address), this.getUserNFTs(address)])

        result.aks = userAssets[0].aks;
        result.nvy = userAssets[0].nvy;

        result.captains = userAssets[1].captains;
        result.ships = userAssets[1].ships;
        result.islands = userAssets[1].islands;

        console.log(result);

        return result;
    }

    private async getUserTokenBalances(address: string) {
        let nvy = 0;
        let aks = 0;

        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            address,
            chain: this.chain,
        }) as any;

        response.data.forEach(f => {
            if (f.token_address == Constants.NvyContractAddress) {
                nvy = Number(ethers.utils.formatEther(f.balance));
            }
            if (f.token_address == Constants.AksContractAddress) {
                aks = Number(ethers.utils.formatEther(f.balance));
            }
        });

        return {
            nvy, aks
        }
    }

    private async getUserNFTs(address: string) {
        const captains: CaptainEntity[] = [];
        const ships: ShipEntity[] = [];
        const islands: IslandEntity[] = [];

        const response = await Moralis.EvmApi.nft.getWalletNFTs({
            address,
            chain: this.chain,
            tokenAddresses: [
                Constants.CaptainContractAddress,
                Constants.ShipContractAddress,
                Constants.IslandContractAddress
            ]
        }) as any;

        const total = response.data.total

        if (total > 0) {
            for (const entity of response.data.result) {
                switch (entity.token_address) {
                    case Constants.CaptainContractAddress: {
                        captains.push(await this.getCaptainNFTsByOwnerAddress(entity));
                        break;
                    }
                    case Constants.ShipContractAddress: {
                        ships.push(await this.getShipNFTsByOwnerAddress(entity));
                        break;
                    }
                    case Constants.IslandContractAddress: {
                        islands.push(await this.getIslandNFTsByOwnerAddress(entity));
                        break;
                    }
                }
            }
        }

        return {
            captains,
            ships,
            islands
        }
    }

    private async getCaptainNFTsByOwnerAddress(entity: any) {
        const metadataAttributes = JSON.parse(entity.metadata).attributes;
        const playerCaptainEntity = {
            id: entity.token_id,
            miningRewardNVY: metadataAttributes[0]['miningRewardNVY'],
            stakingRewardNVY: metadataAttributes[1]['stakingRewardNVY'],
            traits: metadataAttributes[2]['traits'],
            level: metadataAttributes[3]['level'],
            rarity: metadataAttributes[4]['rarity'],
            bg: metadataAttributes[5]['bg'],
            acc: metadataAttributes[6]['acc'],
            head: metadataAttributes[7]['head'],
            haircutOrHat: metadataAttributes[8]['haircutOrHat'],
            clothes: metadataAttributes[9]['clothes'],
        } as CaptainEntity;

        const captain = await this.captainModel.findOne({
            tokenId: playerCaptainEntity.id
        });

        if (!captain) {
            const newCaptain = new this.captainModel();
            newCaptain.tokenId = playerCaptainEntity.id;
            newCaptain.owner = playerCaptainEntity.owner;
            newCaptain.miningRewardNVY = playerCaptainEntity.miningRewardNVY;
            newCaptain.stakingRewardNVY = playerCaptainEntity.stakingRewardNVY;
            newCaptain.traits = playerCaptainEntity.traits;
            newCaptain.level = playerCaptainEntity.level;
            newCaptain.rarity = playerCaptainEntity.rarity;
            newCaptain.bg = playerCaptainEntity.bg;
            newCaptain.acc = playerCaptainEntity.acc;
            newCaptain.head = playerCaptainEntity.head;
            newCaptain.haircutOrHat = playerCaptainEntity.haircutOrHat;
            newCaptain.clothes = playerCaptainEntity.clothes;
            await newCaptain.save();
        } else {
            captain.owner = playerCaptainEntity.owner;
            captain.miningRewardNVY = playerCaptainEntity.miningRewardNVY;
            captain.stakingRewardNVY = playerCaptainEntity.stakingRewardNVY;
            captain.traits = playerCaptainEntity.traits;
            captain.level = playerCaptainEntity.level;
            await captain.save();
        }

        return playerCaptainEntity;
    }

    private async getShipNFTsByOwnerAddress(entity: any) {
        const metadataAttributes = JSON.parse(entity.metadata).attributes;
        const playerShipEntity = {
            id: entity.token_id,
            type: AssetType.COMMON,
            hull: metadataAttributes[0]['hull'],
            armor: metadataAttributes[1]['armor'],
            maxSpeed: metadataAttributes[2]['maxSpeed'],
            accelerationStep: metadataAttributes[3]['accelerationStep'],
            accelerationDelay: metadataAttributes[4]['accelerationDelay'],
            rotationDelay: metadataAttributes[5]['rotationDelay'],
            fireDelay: metadataAttributes[6]['fireDelay'],
            cannons: metadataAttributes[7]['cannons'],
            cannonsRange: metadataAttributes[8]['cannonsRange'],
            cannonsDamage: metadataAttributes[9]['cannonsDamage'],
            traits: metadataAttributes[10]['traits'],
            level: metadataAttributes[11]['level'],
            rarity: metadataAttributes[12]['rarity'],
            size: metadataAttributes[13]['size'],
            currentIntegrity: metadataAttributes[14]['currentIntegrity'],
            maxIntegrity: metadataAttributes[15]['maxIntegrity'],
            windows: metadataAttributes[16]['windows'],
            anchor: metadataAttributes[17]['anchor'],
        } as ShipEntity;

        const ship = await this.shipModel.findOne({
            tokenId: playerShipEntity.id
        });

        if (!ship) {
            const newShip = new this.shipModel();
            newShip.tokenId = playerShipEntity.id;
            newShip.owner = playerShipEntity.owner;
            newShip.hull = playerShipEntity.hull;
            newShip.armor = playerShipEntity.armor;
            newShip.maxSpeed = playerShipEntity.maxSpeed;
            newShip.accelerationStep = playerShipEntity.accelerationStep;
            newShip.accelerationDelay = playerShipEntity.accelerationDelay;
            newShip.rotationDelay = playerShipEntity.rotationDelay;
            newShip.fireDelay = playerShipEntity.fireDelay;
            newShip.cannons = playerShipEntity.cannons;
            newShip.cannonsRange = playerShipEntity.cannonsRange;
            newShip.cannonsDamage = playerShipEntity.cannonsDamage;
            newShip.rarity = playerShipEntity.rarity;
            newShip.size = playerShipEntity.size;
            newShip.level = playerShipEntity.level;
            newShip.windows = playerShipEntity.windows;
            newShip.anchor = playerShipEntity.anchor;
            newShip.currentIntegrity = playerShipEntity.currentIntegrity;
            newShip.maxIntegrity = playerShipEntity.maxIntegrity;
            await newShip.save();
        } else {
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
            await ship.save();
        }

        return playerShipEntity;
    }

    private async getIslandNFTsByOwnerAddress(entity: any) {
        const metadataAttributes = JSON.parse(entity.metadata).attributes;
        const playerIslandEntity = {
            id: entity.token_id,
            level: metadataAttributes[0]['level'],
            rarity: metadataAttributes[1]['rarity'],
            terrain: metadataAttributes[2]['terrain'],
            miningRewardNVY: metadataAttributes[3]['miningRewardNVY'],
            shipAndCaptainFee: metadataAttributes[4]['shipAndCaptainFee'],
            maxMiners: metadataAttributes[5]['maxMiners'],
            minersFee: metadataAttributes[6]['minersFee'],
            x: metadataAttributes[7]['x'],
            y: metadataAttributes[8]['y']
        } as IslandEntity;

        const island = await this.islandModel.findOne({
            tokenId: playerIslandEntity.id
        });

        if (!island) {
            const newIsland = new this.islandModel();
            newIsland.tokenId = playerIslandEntity.id;
            newIsland.owner = playerIslandEntity.owner;
            newIsland.x = playerIslandEntity.x;
            newIsland.y = playerIslandEntity.y;
            newIsland.isBase = false;
            newIsland.terrain = playerIslandEntity.terrain;
            newIsland.rarity = playerIslandEntity.rarity;
            newIsland.mining = false;
            newIsland.miningStartedAt = 0;
            newIsland.miningDurationSeconds = 604800; // 1 Week
            newIsland.miningRewardNVY = 45;
            newIsland.shipAndCaptainFee = 10;
            newIsland.minersFee = 5;
            newIsland.miners = 0;
            newIsland.maxMiners = 3;
            newIsland.level = 0;
            await newIsland.save();
            // island = await AssetService.saveNewIsland(playerIslandEntity.id, playerIslandEntity.rarity, playerIslandEntity.owner, playerIslandEntity.x, playerIslandEntity.y, playerIslandEntity.terrain, false);
            // await WorldService.addNewIslandToSector(island);
        } else {
            island.owner = playerIslandEntity.owner;
            await island.save();
        }

        return playerIslandEntity;
    }
}