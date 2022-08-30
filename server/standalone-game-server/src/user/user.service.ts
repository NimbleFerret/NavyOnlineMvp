/* eslint-disable prettier/prettier */

import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { WorldService } from "src/world/world.service";
import { User, UserDocument, UserWorldState } from "./user.entity";

@Injectable()
export class UserService {

    // TODO implement disconnect events here

    private readonly playersMap = new Map<string, any>();

    constructor(
        private worldService: WorldService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {

    }

    async signInOrUp(ethAddress: string) {
        const user = await this.userModel.findOne({
            ethAddress
        });
        if (user) {
            this.playersMap.set(user.ethAddress, user);
            return user;
        } else {
            const user = new this.userModel({
                ethAddress,
                worldX: WorldService.BASE_POS_X,
                worldY: WorldService.BASE_POS_Y
            });
            this.playersMap.set(user.ethAddress, user);
            return user.save();
        }
    }

    async movePlayerAroundTheWorld(playerEthAddress: string, newX: number, newY: number) {
        const player = this.playersMap.get(playerEthAddress);
        if (player) {
            // Allow move ?
            const x = Math.abs(player.worldX - newX);
            const y = Math.abs(player.worldY - newY);
            if (x <= 1 && y <= 1) {
                player.worldX = newX;
                player.worldY = newY;
                this.playersMap.set(player.ethAddress, await player.save());
                return true;
            } else {
                return false;
            }
        } else {
            Logger.error('Cant move. No player by address: ' + playerEthAddress);
            return false;
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

}