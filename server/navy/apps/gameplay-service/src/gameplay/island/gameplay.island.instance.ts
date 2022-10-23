import { EventEmitter2 } from "@nestjs/event-emitter";
import { BaseGameplayEntity, BaseGameplayInstance } from "../gameplay.base.instance";
import { GameplayType } from "../gameplay.base.service";
import { Model } from "mongoose";
import { ShipDocument } from "@app/shared-library/schemas/schema.ship";
import { NotifyEachPlayerEventMsg, AppEvents } from "../../app.events";
import { SocketServerMessageAddEntity, WsProtocol, SocketServerMessageRemoveEntity } from "../../ws/ws.protocol";
import { engine } from "../../js/IslandEngine.js"

export class GameplayIslandInstance extends BaseGameplayInstance {

    constructor(shipModel: Model<ShipDocument>, eventEmitter: EventEmitter2, public worldX: number, public worldY: number) {
        super(shipModel, eventEmitter, GameplayType.Island, new engine.IslandEngine());

        this.gameEngine.createMainEntityCallback = (entity: object) => {
            const socketServerMessageAddEntity = {
                entity: this.converJsEntityToTypeScript(entity)
            } as SocketServerMessageAddEntity;
            this.notifyAllPlayers(socketServerMessageAddEntity, WsProtocol.SocketServerEventAddEntity);
        };

        this.gameEngine.deleteEntityCallback = (entity: object) => {
            const jsEntity = this.converJsEntityToTypeScript(entity);

            if (this.playerEntityMap.has(jsEntity.ownerId)) {
                this.playerEntityMap.delete(jsEntity.ownerId);
            }

            const socketServerMessageRemoveEntity = {
                entityId: jsEntity.id
            } as SocketServerMessageRemoveEntity;

            const notifyEachPlayerEventMsg = {
                socketEvent: WsProtocol.SocketServerEventRemoveEntity,
                message: socketServerMessageRemoveEntity
            } as NotifyEachPlayerEventMsg;

            this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
        };
    }

    public converJsEntityToTypeScript(jsEntity: any): BaseGameplayEntity {
        const result = {
            y: jsEntity.y,
            x: jsEntity.x,
            id: jsEntity.id,
            ownerId: jsEntity.ownerId
        } as BaseGameplayEntity;
        return result;
    }

}