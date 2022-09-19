/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AppEvents } from "src/app.events";
import { Ship, ShipDocument } from "src/asset/asset.ship.entity";
import { SocketClientMessageRespawn, SocketClientMessageShoot } from "src/ws/ws.protocol";
import { GameplayBaseService, GameplayType } from "../gameplay.base.service";
import { GameplayBattleInstance } from "./gameplay.battle.instance";

@Injectable()
export class GameplayBattleService extends GameplayBaseService {

    constructor(@InjectModel(Ship.name) shipModel: Model<ShipDocument>, private readonly emitter: EventEmitter2) {
        super(shipModel, emitter, GameplayType.Battle);
    }

    // Socket events

    @OnEvent(AppEvents.PlayerShoot)
    async handlePlayerShoot(data: SocketClientMessageShoot) {
        const instanceId = this.playerInstanceMap.get(data.playerId);
        if (instanceId) {
            const gameInstance = this.instances.get(instanceId) as GameplayBattleInstance;
            gameInstance.handlePlayerShoot(data);
        } else {
            // TODO add logs
        }
    }

    @OnEvent(AppEvents.PlayerRespawn)
    async handlePlayerRespawn(data: SocketClientMessageRespawn) {
        const instanceId = this.playerInstanceMap.get(data.playerId);
        if (instanceId) {
            const gameInstance = this.instances.get(instanceId) as GameplayBattleInstance;
            gameInstance.handlePlayerRespawn(data);
        } else {
            // TODO add logs
        }
    }

}