/* eslint-disable prettier/prettier */
import { Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
    SocketClientMessageRespawn,
    SocketClientMessageShoot,
    SocketServerMessageAddEntity,
    SocketServerMessageShipShoot, WsProtocol
} from "src/ws/ws.protocol";
import { engine } from "../../../GameEngine.js"
import { BaseGameplayEntity } from "../gameplay.base.entity";
import { BaseGameplayInstance } from "../gameplay.base.instance";
import { GameplayType } from "../gameplay.base.service";
import { GameplayShipEntity } from "./gameplay.battle.ship.entity.js";

export class GameplayBattleInstance extends BaseGameplayInstance {

    constructor(eventEmitter: EventEmitter2, public worldX: number, public worldY: number) {
        super(eventEmitter, GameplayType.Battle, new engine.GameEngine());
    }

    public getTotalShipsCount() {
        return this.gameEngine.mainEntityManager.entities.size;
    }

    // Player commands
    async handlePlayerShoot(data: SocketClientMessageShoot) {
        const ship = this.playerEntityMap.get(data.playerId);
        if (ship) {
            this.gameEngine.shipShootBySide(data.left ? 'Left' : 'Right', ship, data.shotParams);
            const socketServerMessageShipShoot = {
                playerId: data.playerId,
                left: data.left,
                shotParams: data.shotParams
            } as SocketServerMessageShipShoot;
            this.notifyAllPlayers(socketServerMessageShipShoot, WsProtocol.SocketServerEventShipShoot);
        }
    }

    async handlePlayerRespawn(data: SocketClientMessageRespawn) {
        if (!this.playerEntityMap.has(data.playerId)) {
            const entity = this.addPlayer(data.playerId);
            const socketServerMessageAddEntity = {
                entity
            } as SocketServerMessageAddEntity;
            this.notifyAllPlayers(socketServerMessageAddEntity, WsProtocol.SocketServerEventAddEntity);
        } else {
            Logger.error(`Cant respawn player ${data.playerId} while playing`);
        }
    }

    // Impl
    public converJsEntityToTypeScript(jsEntity: any): BaseGameplayEntity {
        const result = {
            currentArmor: jsEntity.currentArmor,
            currentHull: jsEntity.currentHull,
            y: jsEntity.y,
            x: jsEntity.x,
            currentSpeed: jsEntity.currentSpeed,
            direction: jsEntity.direction._hx_name,
            id: jsEntity.id,
            ownerId: jsEntity.ownerId
        } as GameplayShipEntity;
        return result;
    }

}