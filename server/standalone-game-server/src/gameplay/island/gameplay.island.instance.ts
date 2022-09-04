/* eslint-disable prettier/prettier */
import { engine } from "../../../IslandEngine.js"
import { EventEmitter2 } from "@nestjs/event-emitter";
import { BaseGameplayEntity } from "../gameplay.base.entity";
import { BaseGameplayInstance } from "../gameplay.base.instance";
import {
    SocketServerMessageAddEntity,
    SocketServerMessageRemoveEntity,
    WsProtocol
} from "src/ws/ws.protocol";
import { GameplayType } from "../gameplay.base.service";
import {
    NotifyEachPlayerEventMsg,
    AppEvents
} from "src/app.events";

export class GameplayIslandInstance extends BaseGameplayInstance {

    constructor(eventEmitter: EventEmitter2, public worldX: number, public worldY: number) {
        super(eventEmitter, GameplayType.Island, new engine.IslandEngine());

        this.gameEngine.createEntityCallback = (entity: object) => {
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