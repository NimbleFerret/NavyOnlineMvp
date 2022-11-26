import { Ship, ShipDocument } from "@app/shared-library/schemas/schema.ship";
import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AppEvents } from "../../app.events";
import { SocketClientMessageShoot, SocketClientMessageRespawn, SectorContent } from "../../ws/ws.protocol";
import { BaseGameplayInstance } from "../gameplay.base.instance";
import { GameplayBaseService } from "../gameplay.base.service";
import { GameplayBattleInstance } from "./gameplay.battle.instance";

@Injectable()
export class GameplayBattleService extends GameplayBaseService {

    constructor(@InjectModel(Ship.name) private shipModel: Model<ShipDocument>, private emitter: EventEmitter2) {
        super();
    }

    public initiateGameplayInstance(x: number, y: number, sectorContent: SectorContent): BaseGameplayInstance {
        return new GameplayBattleInstance(this.shipModel, x, y, this.emitter, sectorContent);
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