import { SectorContent } from "@app/shared-library/gprc/grpc.world.service";
import { Ship, ShipDocument } from "@app/shared-library/schemas/schema.ship";
import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AddBotRequestDto, EnableFeatureRequestDto } from "../../app.dto";
import { AppEvents } from "../../app.events";
import { SocketClientMessageRespawn } from "../../ws/ws.protocol";
import { BaseGameplayInstance } from "../gameplay.base.instance";
import { GameplayBaseService } from "../gameplay.base.service";
import { GameplayBattleInstance } from "./gameplay.battle.instance";

@Injectable()
export class GameplayBattleService extends GameplayBaseService {

    constructor(@InjectModel(Ship.name) private shipModel: Model<ShipDocument>, private emitter: EventEmitter2) {
        super();
    }

    public initiateGameplayInstance(x: number, y: number, sectorContent: SectorContent, testInstance: Boolean): BaseGameplayInstance {
        return new GameplayBattleInstance(this.shipModel, x, y, this.emitter, sectorContent, testInstance);
    }

    // -------------------------------
    // API
    // -------------------------------

    async enableShooting(dto: EnableFeatureRequestDto) {
        this.instances.forEach((v, k) => {
            const instance = v as GameplayBattleInstance;
            instance.enableShooting(dto.enable);
        });
    }

    async enableCollisions(dto: EnableFeatureRequestDto) {
        this.instances.forEach((v, k) => {
            const instance = v as GameplayBattleInstance;
            instance.enableCollisions(dto.enable);
        });
    }

    async addBot(dto: AddBotRequestDto) {
        this.instances.forEach((v, k) => {
            const instance = v as GameplayBattleInstance;
            if (instance.testInstance) {
                instance.addBot(dto.x, dto.y);
            }
        });
    }

    // -------------------------------
    // Socket events
    // -------------------------------

    @OnEvent(AppEvents.PlayerRespawn)
    async handlePlayerRespawn(data: SocketClientMessageRespawn) {
        const instanceId = this.playerInstanceMap.get(data.playerId);
        if (instanceId) {
            const gameInstance = this.instances.get(instanceId) as GameplayBattleInstance;
            gameInstance.handlePlayerRespawn(data);
        }
    }

}