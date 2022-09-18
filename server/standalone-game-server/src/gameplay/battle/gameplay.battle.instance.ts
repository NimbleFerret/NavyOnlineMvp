/* eslint-disable prettier/prettier */
import { Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AppEvents, PlayerKilledShip } from "../../app.events.js";
import {
    SectorContent,
    SocketClientMessageRespawn,
    SocketClientMessageShoot,
    SocketServerMessageAddEntity,
    SocketServerMessageRemoveEntity,
    SocketServerMessageShipShoot, WsProtocol
} from "src/ws/ws.protocol";
import { engine } from "../../../GameEngine.js"
import { BaseGameplayEntity } from "../gameplay.base.entity";
import { BaseGameplayInstance } from "../gameplay.base.instance";
import { GameplayShipEntity } from "./gameplay.battle.ship.entity.js";
import { GameplayType } from "../gameplay.base.service";


export class GameplayBattleInstance extends BaseGameplayInstance {

    constructor(eventEmitter: EventEmitter2, public worldX: number, public worldY: number, sectorContent: SectorContent) {
        super(eventEmitter, GameplayType.Battle, new engine.GameEngine());

        this.gameEngine.deleteMainEntityCallback = (ship: object) => {
            const jsShip = this.converJsEntityToTypeScript(ship) as GameplayShipEntity;
            const killerId = this.entityPlayerMap.get(jsShip.killerId);

            if (killerId) {
                let eventType = AppEvents.PlayerKilledBot;
                if (jsShip.role == 'Boss') {
                    eventType = AppEvents.PlayerKilledBoss;
                } else if (jsShip.role == 'Player') {
                    eventType = AppEvents.PlayerKilledPlayer;
                }
                this.eventEmitter.emit(eventType, {
                    playerId: killerId
                } as PlayerKilledShip);
            }

            const socketServerMessageRemoveEntity = {
                entityId: jsShip.id
            } as SocketServerMessageRemoveEntity;

            this.notifyAllPlayers(socketServerMessageRemoveEntity, WsProtocol.SocketServerEventRemoveEntity);
        };

        this.gameEngine.createShellCallback = (shells: any) => {
            const ship = this.gameEngine.getMainEntityById(shells[0].ownerId);
            if (ship && ship.role != 'Player') {
                const shotParams = shells.map(shell => {
                    return {
                        speed: shell.shellRnd.speed,
                        dir: shell.shellRnd.dir,
                        rotation: shell.shellRnd.rotation
                    }
                });
                const socketServerMessageShipShoot = {
                    playerId: ship.ownerId,
                    left: shells[0].side == 'Left' ? true : false,
                    shotParams
                } as SocketServerMessageShipShoot;
                this.notifyAllPlayers(socketServerMessageShipShoot, WsProtocol.SocketServerEventShipShoot);
            }
        };

        switch (sectorContent) {
            case SectorContent.BOSS: {
                this.gameEngine.createEntity('Boss', 200, 500, 'MEDIUM', 'TWO', 'FOUR', undefined, undefined);
                break;
            }
            case SectorContent.PVE: {
                this.gameEngine.createEntity('Bot', 500, 500, 'Small', 'NONE', 'TWO', undefined, undefined);
                this.gameEngine.createEntity('Bot', 700, 500, 'Small', 'NONE', 'TWO', undefined, undefined);
                this.gameEngine.createEntity('Bot', 900, 500, 'Small', 'NONE', 'TWO', undefined, undefined);
                break;
            }
            case SectorContent.PVP: {
                // TODO enable pvp damage
                break;
            }
        }
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
        let shipHullSize = 0;
        let shipWindows = 2;
        let shipGuns = 2;

        if (jsEntity.shipHullSize == 'MEDIUM') {
            shipHullSize = 1;
        }

        if (jsEntity.shipWindows == 'ONE') {
            shipWindows = 0;
        }
        if (jsEntity.shipWindows == 'TWO') {
            shipWindows = 1;
        }

        if (jsEntity.shipGuns == 'ONE') {
            shipGuns = 0;
        }
        if (jsEntity.shipGuns == 'TWO') {
            shipGuns = 1;
        }
        if (jsEntity.shipGuns == 'FOUR') {
            shipGuns = 3;
        }

        const result = {
            killerId: jsEntity.killerId,
            role: jsEntity.role,
            currentArmor: jsEntity.currentArmor,
            currentHull: jsEntity.currentHull,
            y: jsEntity.y,
            x: jsEntity.x,
            currentSpeed: jsEntity.currentSpeed,
            direction: jsEntity.direction._hx_name,
            id: jsEntity.id,
            ownerId: jsEntity.ownerId,
            shipHullSize,
            shipWindows,
            shipGuns
        } as GameplayShipEntity;
        return result;
    }

}