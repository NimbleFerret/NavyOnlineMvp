/* eslint-disable prettier/prettier */
import { Model } from "mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { AppEvents, PlayerDisconnectedEvent } from "../app.events";
import { User, UserDocument, UserWorldState } from "./user.entity";
import { MoralisService } from "../moralis/moralis.service";
import { AssetService, AssetType } from "../asset/asset.service";
import { WorldService } from "../world/world.service";
import { PlayerIslandEntity } from "../asset/asset.island.entity";
import { PlayerShipEntity } from "../asset/asset.ship.entity";
import { PlayerCaptainEntity } from "../asset/asset.captain.entity";

export interface SignInOrUpResponse {
    ethAddress: string;
    nickname: string;
    worldX: number;
    worldY: number;
    ownedCaptains?: PlayerCaptainEntity[];
    ownedShips?: PlayerShipEntity[];
    ownedIslands?: PlayerIslandEntity[];
}

@Injectable()
export class UserService {

    private readonly playersMap = new Map<string, any>();

    constructor(
        private moralisService: MoralisService,
        private assetService: AssetService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {
    }

    @OnEvent(AppEvents.PlayerDisconnected)
    async handlePlayerDisconnected(data: PlayerDisconnectedEvent) {
        this.playersMap.delete(data.playerId);
    }

    async signInOrUp(ethAddress: string) {
        let user = await this.userModel.findOne({
            ethAddress
        }).populate('shipsOwned').populate('captainsOwned').populate('islandsOwned');
        if (user) {
            this.playersMap.set(user.ethAddress, user);
            user = await this.syncPlayerNFTs(user);
        } else {
            const userModel = new this.userModel({
                ethAddress,
                worldX: WorldService.BASE_POS_X,
                worldY: WorldService.BASE_POS_Y
            });
            this.playersMap.set(userModel.ethAddress, userModel);
            const newFreeCaptain = await this.assetService.generateFreeCaptain(userModel.ethAddress);
            const newFreeShip = await this.assetService.generateFreeShip(userModel.ethAddress);
            userModel.captainsOwned = [newFreeCaptain];
            userModel.shipsOwned = [newFreeShip];
            user = await userModel.save();
        }

        const ownedCaptains = user.captainsOwned.map(f => {
            return {
                id: f.tokenId,
                owner: f.owner,
                type: f.type,
                level: f.level,
                traits: f.traits,
                miningRewardNVY: f.miningRewardNVY,
                stakingRewardNVY: f.stakingRewardNVY,
                miningStartedAt: f.miningStartedAt,
                miningDurationSeconds: f.miningDurationSeconds,
                rarity: f.rarity,
                bg: f.bg,
                acc: f.acc,
                head: f.head,
                haircutOrHat: f.haircutOrHat,
                clothes: f.clothes,
            } as PlayerCaptainEntity;
        });

        const ownedShips = user.shipsOwned.map(f => {
            return {
                id: f.tokenId,
                owner: f.owner,
                type: f.type,
                armor: f.armor,
                hull: f.hull,
                maxSpeed: f.maxSpeed,
                accelerationStep: f.accelerationStep,
                accelerationDelay: f.accelerationDelay,
                rotationDelay: f.rotationDelay,
                cannons: f.cannons,
                cannonsRange: f.cannonsRange,
                cannonsDamage: f.cannonsDamage,
                level: f.level,
                traits: f.traits,
                size: f.size,
                rarity: f.rarity,
                windows: f.windows,
                anchor: f.anchor,
            } as PlayerShipEntity;
        });

        const ownedIslands = user.islandsOwned.map(f => {
            return {
                id: f.tokenId,
                owner: f.owner,
                level: f.level,
                rarity: f.rarity,
                terrain: f.terrain,
                size: f.size,
                miningRewardNVY: f.miningRewardNVY,
                shipAndCaptainFee: f.shipAndCaptainFee,
                minersFee: f.minersFee,
                maxMiners: f.maxMiners,
                miners: f.miners
            } as PlayerIslandEntity;
        });

        const signInOrUpResponse = {
            ethAddress: user.ethAddress,
            nickname: user.nickname,
            worldX: user.worldX,
            worldY: user.worldY,
            ownedCaptains,
            ownedShips,
            ownedIslands
        } as SignInOrUpResponse;

        return signInOrUpResponse;
    }

    checkPlayerPos(playerEthAddress: string, x: number, y: number) {
        const player = this.playersMap.get(playerEthAddress);
        if (player) {
            return player.worldX == x && player.worldY == y;
        } else {
            return false;
        }
    }

    async movePlayerAroundTheWorld(playerEthAddress: string, newX: number, newY: number) {
        let result = false;
        const player = this.playersMap.get(playerEthAddress);
        if (player) {
            // Allow move ?
            const x = Math.abs(player.worldX - newX);
            const y = Math.abs(player.worldY - newY);
            if (x <= 1 && y <= 1) {
                player.worldX = newX;
                player.worldY = newY;
                this.playersMap.set(player.ethAddress, await player.save());
                result = true;
            }
        } else {
            Logger.error('Cant move. No player by address: ' + playerEthAddress);
        }
        return {
            result
        }
    }

    async joinCurrentSector(playerEthAddress: string) {
        const player = this.playersMap.get(playerEthAddress);
        if (player) {
            player.worldState = UserWorldState.SECTOR;
            this.playersMap.set(player.ethAddress, await player.save());
            // TODO emit game event here
            return true;
        } else {
            Logger.error('Cant join sector. No player by address: ' + playerEthAddress);
            return false;
        }
    }

    async leaveCurrentSector(playerEthAddress: string) {
        const player = this.playersMap.get(playerEthAddress);
        if (player) {
            player.worldState = UserWorldState.WORLD;
            this.playersMap.set(player.ethAddress, await player.save());
            // TODO emit game event here
            return true;
        } else {
            Logger.error('Cant leave sector. No player by address: ' + playerEthAddress);
            return false;
        }
    }

    async findAll() {
        return this.userModel.find().exec();
    }

    async syncPlayerNFTs(user: UserDocument): Promise<any> {
        const nftBasicInfo = await this.moralisService.loadUserNFTs(user.ethAddress);
        const freeCaptain = user.captainsOwned.filter(f => f.type == AssetType.FREE)[0];
        const freeShip = user.shipsOwned.filter(f => f.type == AssetType.FREE)[0];

        // Sync captains
        user.captainsOwned = [freeCaptain];
        for (const nftCaptain of nftBasicInfo.captains) {
            const captain = await this.assetService.syncCaptainIfNeeded(nftCaptain);
            user.captainsOwned.push(captain)
        }

        // Sync ships
        user.shipsOwned = [freeShip];
        for (const nftShip of nftBasicInfo.ships) {
            const ship = await this.assetService.syncShipIfNeeded(nftShip);
            user.shipsOwned.push(ship)
        }

        // Sync islands
        // const islands = user.islandsOwned.filter(f => f.type == AssetType.COMMON)[0];


        user = await user.save();
        return user;
    }

}