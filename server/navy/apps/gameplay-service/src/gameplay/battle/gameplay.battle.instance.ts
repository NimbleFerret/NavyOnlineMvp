import { Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AppEvents, PlayerKilledShip } from "../../app.events.js";
import { BaseGameplayInstance } from "../gameplay.base.instance";
import { GameplayType } from "../gameplay.base.service";
import { Model } from "mongoose";
import { engine } from "../../js/IslandEngine.js"
import { ShipDocument } from "@app/shared-library/schemas/schema.ship.js";
import {
    SectorContent,
    SocketServerMessageRemoveEntity,
    WsProtocol,
    SocketServerMessageShipShoot,
    SocketServerMessageAddEntity,
    SocketClientMessageShoot,
    SocketClientMessageRespawn
} from "../../ws/ws.protocol.js";
import { SharedLibraryService } from "@app/shared-library";
import { GameObjectShipEntity, ShipEntity } from "@app/shared-library/entities/entity.ship.js";
import { AssetType, Rarity, ShipSize } from "@app/shared-library/shared-library.main.js";

export class GameplayBattleInstance extends BaseGameplayInstance {

    constructor(
        private shipModel: Model<ShipDocument>,
        public x: number,
        public y: number,
        eventEmitter: EventEmitter2,
        sectorContent: SectorContent
    ) {
        super(eventEmitter, GameplayType.Battle, new engine.GameEngine());

        this.gameEngine.deleteMainEntityCallback = async (ship: object) => {
            const jsShip = this.converJsEntityToTypeScript(ship);
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
                if (jsShip.role == 'Player' && jsShip.type != AssetType.FREE) {
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

    // --------------------------
    // Player input
    // --------------------------

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
            const entity = await this.addPlayer(data.playerId, data.entityId);
            const socketServerMessageAddEntity = {
                entity
            } as SocketServerMessageAddEntity;
            this.notifyAllPlayers(socketServerMessageAddEntity, WsProtocol.SocketServerEventAddEntity);
        } else {
            Logger.error(`Cant respawn player ${data.playerId} while playing`);
        }
    }

    // --------------------------
    // Implementations
    // --------------------------

    public async initiateEngineEntity(playerId: string, entityid: string) {
        let ship: ShipEntity;
        if (entityid == 'free') {
            ship = SharedLibraryService.GetFreeShip();
        } else {
            ship = await this.shipModel.findOne({ tokenId: entityid });

        }

        let windows = 'NONE';
        if (ship.windows == 0) {
            windows = 'ONE';
        } else if (ship.windows == 1) {
            windows = 'TWO';
        }

        let cannons = 'ONE';
        if (ship.cannons == 2) {
            cannons = 'TWO';
        } else if (ship.cannons == 3) {
            cannons = 'THREE';
        } else if (ship.cannons == 4) {
            cannons = 'FOUR';
        }

        const engineEntity = this.gameEngine.createEntity(
            entityid,
            ship.id == 'free',
            'Player',
            100,
            (this.playerEntityMap.size) * 500,
            ship.size == 1 ? 'SMALL' : 'MEDIUM',
            windows,
            cannons,
            ship.cannonsRange,
            ship.cannonsDamage,
            ship.armor,
            ship.hull,
            ship.maxSpeed,
            ship.accelerationStep,
            ship.accelerationDelay / 1000,
            ship.rotationDelay / 1000,
            ship.fireDelay / 1000,
            undefined,
            playerId);
        return engineEntity;
    }

    public converJsEntityToTypeScript(jsEntity: any) {
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
            id: jsEntity.id,
            owner: jsEntity.ownerId,
            type: AssetType.FREE,
            armor: jsEntity.armor,
            hull: jsEntity.hull,
            maxSpeed: jsEntity.maxSpeed,
            accelerationStep: jsEntity.acc,
            accelerationDelay: jsEntity.accDelay,
            rotationDelay: jsEntity.turnDelay,
            fireDelay: jsEntity.fireDelay,
            cannons: shipGuns,
            cannonsRange: jsEntity.cannonsRange,
            cannonsDamage: jsEntity.cannonsDamage,
            level: 1,
            traits: 0,
            size: ShipSize.SMALL,
            rarity: Rarity.COMMON,
            windows: shipWindows,
            anchor: 0,
            currentIntegrity: jsEntity.currentIntegrity,
            maxIntegrity: jsEntity.maxIntegrity,
            x: jsEntity.x,
            y: jsEntity.y,
            direction: jsEntity.direction._hx_name,
            role: jsEntity.role,
            currentSpeed: jsEntity.currentSpeed,
            serverShipRef: jsEntity.serverShipRef,
            killerId: jsEntity.killerId,
            currentArmor: jsEntity.currentArmor,
            currentHull: jsEntity.currentHull,
        } as GameObjectShipEntity;
        return result;
    }

}