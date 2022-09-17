/* eslint-disable prettier/prettier */
import { Model } from "mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { AppEvents, PlayerDisconnectedEvent } from "src/app.events";
import { User, UserDocument, UserWorldState } from "./user.entity";
import { MoralisService } from "src/moralis/moralis.service";
import { ShipyardService } from "src/shipyard/shipyard.service";
import { WorldService } from "src/world/world.service";
import { PlayerCaptainEntity } from "./asset/asset.captain.entity";
import { PlayerIslandEntity } from "./asset/asset.island.entity";
import { PlayerShipEntity, ShipType } from "./asset/asset.ship.entity";

export interface SignInOrUpResponse {
    ethAddress: string;
    nickname: string;
    worldX: number;
    worldY: number;
    captains?: PlayerCaptainEntity[];
    ownedShips?: PlayerShipEntity[];
    islands?: PlayerIslandEntity[];
}

@Injectable()
export class UserService {

    private readonly playersMap = new Map<string, any>();

    constructor(
        private shipyardService: ShipyardService,
        private moralisService: MoralisService,
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
        }).populate('shipsOwned');
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
            const newFreeShip = await this.shipyardService.generateFreeShip();
            userModel.shipsOwned = [newFreeShip];
            user = await userModel.save();
        }

        const ownedShips = user.shipsOwned.map(f => {
            return {
                id: f.tokenId,
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

        // TODO Rename
        const ownedIslands = user.islandsOwned.map(f => {
            return 1;
        });

        const signInOrUpResponse = {
            ethAddress: user.ethAddress,
            nickname: user.nickname,
            worldX: user.worldX,
            worldY: user.worldY,
            ownedShips
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
        const freeShip = user.shipsOwned.filter(f => f.type == ShipType.FREE)[0];

        // Sync ships
        user.shipsOwned = [freeShip];
        for (const nftShip of nftBasicInfo.ships) {
            const ship = await this.shipyardService.syncShipIfNeeded(nftShip);
            user.shipsOwned.push(ship)
        }

        // Sync islands

        user = await user.save();
        return user;
    }
}