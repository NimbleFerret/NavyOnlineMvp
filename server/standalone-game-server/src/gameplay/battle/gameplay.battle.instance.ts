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
import { Model } from "mongoose";
import { ShipDocument } from "../../asset/asset.ship.entity.js";

export class GameplayBattleInstance extends BaseGameplayInstance {

    constructor(shipModel: Model<ShipDocument>, eventEmitter: EventEmitter2, public worldX: number, public worldY: number, sectorContent: SectorContent) {
        super(shipModel, eventEmitter, GameplayType.Battle, new engine.GameEngine());

        this.gameEngine.deleteMainEntityCallback = async (ship: object) => {
            const jsShip = this.converJsEntityToTypeScript(ship) as GameplayShipEntity;
            console.log('deleteMainEntityCallback 1');
            if (jsShip.killerId) {
                const killerId = this.entityPlayerMap.get(jsShip.killerId);
                const killerShip = this.gameEngine.getMainEntityById(jsShip.killerId);

                if (killerShip.role == 'Player') {
                    console.log('deleteMainEntityCallback 2');
                    if (killerId) {
                        console.log('deleteMainEntityCallback 3');
                        let eventType = AppEvents.PlayerKilledBot;
                        if (jsShip.role == 'Boss') {
                            eventType = AppEvents.PlayerKilledBoss;
                        } else if (jsShip.role == 'Player') {
                            eventType = AppEvents.PlayerKilledPlayer;
                        }
                        this.eventEmitter.emit(eventType, {
                            playerId: killerId
                        } as PlayerKilledShip);
                        console.log('deleteMainEntityCallback 4');
                    }
                }

                console.log('deleteMainEntityCallback 5');
                if (jsShip.role == 'Player' && !jsShip.free) {
                    const shipToUpdate = await shipModel.findOne({ tokenId: jsShip.serverShipRef });
                    shipToUpdate.currentIntegrity -= 1;
                    await shipToUpdate.save();
                }
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

        this.gameEngine.createMainEntityCallback = (ship: object) => {
            const socketServerMessageAddEntity = {
                entity: this.converJsEntityToTypeScript(ship)
            } as SocketServerMessageAddEntity;
            this.notifyAllPlayers(socketServerMessageAddEntity, WsProtocol.SocketServerEventAddEntity);
        };

        switch (sectorContent) {
            case SectorContent.BOSS: {
                this.gameEngine.createEntity('', true, 'Boss', 200, 500, 'MEDIUM', 'TWO', 'FOUR',
                    2000, 80, 500, 500, 200, 100, 100 / 1000, 200 / 1000, 200 / 1000,
                    undefined, undefined);
                break;
            }
            case SectorContent.PVE: {
                this.gameEngine.createEntity('', true, 'Bot', 400, -200, 'Small', 'NONE', 'TWO',
                    600, 10, 300, 300, 200, 100, 100 / 1000, 200 / 1000, 200 / 1000,
                    undefined, undefined);
                // this.gameEngine.createEntity('Bot', 700, 500, 'Small', 'NONE', 'TWO', undefined, undefined);
                // this.gameEngine.createEntity('Bot', 900, 500, 'Small', 'NONE', 'TWO', undefined, undefined);
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
            const entity = await this.addPlayer(data.playerId);
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
            serverShipRef: jsEntity.serverShipRef,
            free: jsEntity.free,
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
            shipGuns,
            cannonsRange: jsEntity.cannonsRange,
            cannonsDamage: jsEntity.cannonsDamage,
            armor: jsEntity.armor,
            hull: jsEntity.hull,
            maxSpeed: jsEntity.maxSpeed,
            acc: jsEntity.acc,
            accDelay: jsEntity.accDelay,
            turnDelay: jsEntity.turnDelay,
            fireDelay: jsEntity.fireDelay,
            currentIntegrity: jsEntity.currentIntegrity,
            maxIntegrity: jsEntity.maxIntegrity
        } as GameplayShipEntity;
        return result;
    }

}