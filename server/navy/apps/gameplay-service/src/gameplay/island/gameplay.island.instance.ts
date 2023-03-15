import { EventEmitter2 } from "@nestjs/event-emitter";
import { BaseGameplayInstance } from "../gameplay.base.instance";
import { GameplayType } from "../gameplay.base.service";
import {
    SocketServerMessageAddEntity,
    WsProtocol,
} from "../../ws/ws.protocol";
import { game } from "../../js/NavyIslandEngine.js"
import { BaseGameObject } from "@app/shared-library/entities/entity.base";
import { SectorContent } from "@app/shared-library/gprc/grpc.world.service";
import { Logger } from "@nestjs/common";
import { CaptainEntity, CaptainObjectEntity } from "@app/shared-library/entities/entity.captain";

export class GameplayIslandInstance extends BaseGameplayInstance {

    constructor(
        eventEmitter: EventEmitter2,
        x: number,
        y: number,
        public sectorContent: SectorContent,
        testInstance: boolean
    ) {
        super(eventEmitter, GameplayType.Island, new game.engine.navy.NavyIslandEngine(), x, y, testInstance);

        this.gameEngine.createMainEntityCallback = (entity: object) => {
            const socketServerMessageAddEntity = {
                entity: this.converJsEntityToTypeScript(entity, true)
            } as SocketServerMessageAddEntity;
            this.notifyAllPlayers(socketServerMessageAddEntity, WsProtocol.SocketServerEventAddEntity);
        };

        this.gameEngine.deleteEntityCallback = (entity: object) => {
            // const jsEntity = this.converJsEntityToTypeScript(entity);

            // if (this.playerEntityMap.has(jsEntity.owner)) {
            //     this.playerEntityMap.delete(jsEntity.owner);
            // }

            // const socketServerMessageRemoveEntity = {
            //     entityId: jsEntity.id
            // } as SocketServerMessageRemoveEntity;

            // const notifyEachPlayerEventMsg = {
            //     socketEvent: WsProtocol.SocketServerEventRemoveEntity,
            //     message: socketServerMessageRemoveEntity
            // } as NotifyEachPlayerEventMsg;

            // this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
        };

        Logger.log(`GameplayIslandInstance created. x: ${x}, y: ${y}, content :${sectorContent} test: ${testInstance}`);
    }

    // --------------------------
    // Implementations
    // --------------------------

    public initiateEngineEntity(playerId: string, entityid: string) {
        const captain = CaptainEntity.GetFreeCaptainStats(entityid, playerId);
        // captain.x = this.playerX;
        // this.playerX += 250;
        const engineEntity = this.gameEngine.buildEngineEntity(captain);
        this.gameEngine.createMainEntity(engineEntity, true);
        return engineEntity;
    }

    public converJsEntityToTypeScript(jsEntity: any, full: boolean) {
        const objectEntity = {
            // x: jsEntity.shipObjectEntity.x,
            // y: jsEntity.shipObjectEntity.y,
            // id: jsEntity.shipObjectEntity.id,
            // direction: jsEntity.shipObjectEntity.direction,
            // currentSpeed: jsEntity.shipObjectEntity.currentSpeed,
            // armor: jsEntity.shipObjectEntity.armor,
            // hull: jsEntity.shipObjectEntity.hull,
        } as CaptainObjectEntity;

        return {} as BaseGameObject;
        // const result = {
        //     y: jsEntity.y,
        //     x: jsEntity.x,
        //     id: jsEntity.id,
        //     owner: jsEntity.ownerId
        // } as BaseGameObject;
        // return result;
    }

}