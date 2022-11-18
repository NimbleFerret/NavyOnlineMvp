import { EventEmitter2 } from "@nestjs/event-emitter";
import { BaseGameplayInstance } from "../gameplay.base.instance";
import { GameplayType } from "../gameplay.base.service";
import { NotifyEachPlayerEventMsg, AppEvents } from "../../app.events";
import {
    SocketServerMessageAddEntity,
    SocketServerMessageRemoveEntity,
    SectorContent,
    WsProtocol,
} from "../../ws/ws.protocol";
import { engine } from "../../js/IslandEngine.js"
import { BaseGameObject } from "@app/shared-library/entities/entity.base";

export class GameplayIslandInstance extends BaseGameplayInstance {

    constructor(
        eventEmitter: EventEmitter2,
        public x: number,
        public y: number,
        public sectorContent: SectorContent
    ) {
        super(eventEmitter, GameplayType.Island, new engine.IslandEngine());

        this.gameEngine.createMainEntityCallback = (entity: object) => {
            const socketServerMessageAddEntity = {
                entity: this.converJsEntityToTypeScript(entity)
            } as SocketServerMessageAddEntity;
            this.notifyAllPlayers(socketServerMessageAddEntity, WsProtocol.SocketServerEventAddEntity);
        };

        this.gameEngine.deleteEntityCallback = (entity: object) => {
            const jsEntity = this.converJsEntityToTypeScript(entity);

            if (this.playerEntityMap.has(jsEntity.owner)) {
                this.playerEntityMap.delete(jsEntity.owner);
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

    // --------------------------
    // Implementations
    // --------------------------

    public initiateEngineEntity(playerId: string, entityid: string) {
        return this.gameEngine.createEntity(350, 290, undefined, playerId);
    }

    public converJsEntityToTypeScript(jsEntity: any) {
        const result = {
            y: jsEntity.y,
            x: jsEntity.x,
            id: jsEntity.id,
            owner: jsEntity.ownerId
        } as BaseGameObject;
        return result;
    }

}