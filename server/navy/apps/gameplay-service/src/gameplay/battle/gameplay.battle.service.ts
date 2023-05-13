import { Role } from "@app/shared-library/entities/entity.ship";
import { SectorContent } from "@app/shared-library/gprc/grpc.world.service";
import { Ship, ShipDocument } from "@app/shared-library/schemas/entity/schema.ship";
import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AddBotRequestDto, EnableFeatureRequestDto, KillBotsRequestDto } from "../../app.dto";
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

    public initiateGameplayInstance(x: number, y: number, sectorContent: SectorContent, testInstance: boolean, defaultBots: boolean): BaseGameplayInstance {
        return new GameplayBattleInstance(this.shipModel, x, y, this.emitter, sectorContent, testInstance, defaultBots);
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
            if (instance.isTest && (dto.instanceId && instance.instanceId == dto.instanceId || !dto.instanceId)) {
                instance.addBot(dto.x, dto.y);
            }
        });
    }

    async killBots(dto: KillBotsRequestDto) {
        const instance = this.instances.get(dto.instanceId);
        if (instance) {
            const entitiesToDelete: string[] = [];
            instance.gameEngine.mainEntityManager.entities.forEach(entity => {
                if (entity.baseObjectEntity.role == Role.BOT) {
                    entitiesToDelete.push(entity.getId());
                }
            });
            entitiesToDelete.forEach(entityId => {
                instance.gameEngine.removeMainEntity(entityId);
            });
        }
    }

}