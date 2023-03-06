import { Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { BaseGameplayInstance } from "../gameplay.base.instance";
import { GameplayType } from "../gameplay.base.service";
import { Model } from "mongoose";
import { game } from "../../js/GameEngine.js"
import { ShipDocument } from "@app/shared-library/schemas/schema.ship";
import {
    WsProtocol,
    SocketServerMessageEntityInput,
    SocketServerMessageAddEntity,
    SocketClientMessageRespawn,
    PlayerInputType
} from "../../ws/ws.protocol";
import { SectorContent } from "@app/shared-library/gprc/grpc.world.service";
import { Role, ShipEntity, ShipObjectEntity } from "@app/shared-library/entities/entity.ship";


// ---------------------------------------
export class GameplayBattleInstance extends BaseGameplayInstance {

    constructor(
        private shipModel: Model<ShipDocument>,
        x: number,
        y: number,
        eventEmitter: EventEmitter2,
        sectorContent: SectorContent,
        public testInstance: Boolean
    ) {
        super(eventEmitter, testInstance ? GameplayType.BattleTest : GameplayType.Battle, new game.engine.GameEngine(), x, y);

        this.gameEngine.deleteMainEntityCallback = async (ship: object) => {
            // const jsShip = this.converJsEntityToTypeScript(ship);
            // console.log('deleteMainEntityCallback 1');
            // if (jsShip.killerId) {
            //     const killerId = this.entityPlayerMap.get(jsShip.killerId);
            //     const killerShip = this.gameEngine.getMainEntityById(jsShip.killerId);

            //     if (killerShip.role == 'Player') {
            //         console.log('deleteMainEntityCallback 2');
            //         if (killerId) {
            //             console.log('deleteMainEntityCallback 3');
            //             let eventType = AppEvents.PlayerKilledBot;
            //             if (jsShip.role == 'Boss') {
            //                 eventType = AppEvents.PlayerKilledBoss;
            //             } else if (jsShip.role == 'Player') {
            //                 eventType = AppEvents.PlayerKilledPlayer;
            //             }
            //             this.eventEmitter.emit(eventType, {
            //                 playerId: killerId
            //             } as PlayerKilledShip);
            //             console.log('deleteMainEntityCallback 4');
            //         }
            //     }

            //     console.log('deleteMainEntityCallback 5');
            //     if (jsShip.role == 'Player' && jsShip.type != AssetType.FREE) {
            //         const shipToUpdate = await shipModel.findOne({ tokenId: jsShip.serverShipRef });
            //         shipToUpdate.currentIntegrity -= 1;
            //         await shipToUpdate.save();
            //     }
            // }

            // const socketServerMessageRemoveEntity = {
            //     entityId: jsShip.id
            // } as SocketServerMessageRemoveEntity;

            // this.notifyAllPlayers(socketServerMessageRemoveEntity, WsProtocol.SocketServerEventRemoveEntity);
        };

        this.gameEngine.createShellCallback = (createShellCallback: any) => {
            const socketServerMessageShipInput = {
                playerId: createShellCallback.shooterId,
                playerInputType: PlayerInputType.SHOOT,
                shootDetails: {
                    side: createShellCallback.side,
                    aimAngleRads: createShellCallback.aimAngleRads
                }
            } as SocketServerMessageEntityInput;
            this.notifyAllPlayers(socketServerMessageShipInput, WsProtocol.SocketServerEventEntityInput, createShellCallback.shooterId);
        };

        this.gameEngine.createMainEntityCallback = (ship: object) => {
            const socketServerMessageAddEntity = {
                entity: this.converJsEntityToTypeScript(ship)
            } as SocketServerMessageAddEntity;
            this.notifyAllPlayers(socketServerMessageAddEntity, WsProtocol.SocketServerEventAddEntity);
        };

        switch (sectorContent) {
            case SectorContent.SECTOR_CONTENT_BOSS: {
                this.gameEngine.createEntity('', true, 'Boss', 200, 500, 'MEDIUM', 'TWO', 'FOUR',
                    2000, 80, 500, 500, 200, 100, 100 / 1000, 200 / 1000, 200 / 1000,
                    undefined, undefined);
                break;
            }
            case SectorContent.SECTOR_CONTENT_PVE: {
                this.gameEngine.createEntity('', true, 'Bot', 400, -200, 'Small', 'NONE', 'TWO',
                    600, 10, 300, 300, 200, 100, 100 / 1000, 200 / 1000, 200 / 1000,
                    undefined, undefined);
                // this.gameEngine.createEntity('Bot', 700, 500, 'Small', 'NONE', 'TWO', undefined, undefined);
                // this.gameEngine.createEntity('Bot', 900, 500, 'Small', 'NONE', 'TWO', undefined, undefined);
                break;
            }
            case SectorContent.SECTOR_CONTENT_PVP: {
                // TODO enable pvp damage
                break;
            }
        }

        if (testInstance) {
            this.intiateBotShips();
        }

        Logger.log(`GameplayBattleInstance created. x:${x}, y:${y}, content:${sectorContent} test:${testInstance}`);
    }

    // --------------------------
    // Admin 
    // --------------------------

    public enableShooting(enable: boolean) {
        this.gameEngine.enableShooting = enable;
    }

    public enableCollisions(enable: boolean) {
        this.gameEngine.enableCollisions = enable;
    }

    public getTotalShipsCount() {
        return this.gameEngine.mainEntityManager.entities.size;
    }

    // --------------------------
    // Player input
    // --------------------------

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

    public initiateEngineEntity(playerId: string, entityid: string) {
        const ship = ShipEntity.GetFreeShipStats(entityid, playerId);
        const engineEntity = this.gameEngine.buildEngineEntity(ship);
        this.gameEngine.createMainEntity(engineEntity, true);
        return engineEntity;
    }

    public converJsEntityToTypeScript(jsEntity: any) {
        return {
            x: jsEntity.shipObjectEntity.x,
            y: jsEntity.shipObjectEntity.y,
            id: jsEntity.shipObjectEntity.id,
            ownerId: jsEntity.shipObjectEntity.ownerId,
            acceleration: jsEntity.shipObjectEntity.acceleration,
            minSpeed: jsEntity.shipObjectEntity.minSpeed,
            maxSpeed: jsEntity.shipObjectEntity.maxSpeed,
            direction: jsEntity.shipObjectEntity.direction,
            serverShipRef: jsEntity.shipObjectEntity.serverShipRef,
            free: jsEntity.shipObjectEntity.free,
            role: jsEntity.shipObjectEntity.role,
            shipHullSize: jsEntity.shipObjectEntity.shipHullSize,
            shipWindows: jsEntity.shipObjectEntity.shipWindows,
            shipCannons: jsEntity.shipObjectEntity.shipCannons,
            cannonsRange: jsEntity.shipObjectEntity.cannonsRange,
            cannonsDamage: jsEntity.shipObjectEntity.cannonsDamage,
            cannonsAngleSpread: jsEntity.shipObjectEntity.cannonsAngleSpread,
            armor: jsEntity.shipObjectEntity.armor,
            hull: jsEntity.shipObjectEntity.hull,
            accDelay: jsEntity.shipObjectEntity.accDelay,
            turnDelay: jsEntity.shipObjectEntity.turnDelay,
            fireDelay: jsEntity.shipObjectEntity.fireDelay
        } as ShipObjectEntity;
    }

    // --------------------------
    // Bots
    // --------------------------

    private botIndex = 0;
    private botAutoPosX = 0;
    private botAutoPosY = -200;

    public addBot(x?: number, y?: number) {
        if (!x || !y) {
            x = this.botAutoPosX;
            y = this.botAutoPosY;
            this.botAutoPosX += 250;
        }
        this.botIndex++;
        const ship = ShipEntity.GetFreeShipStats('bot_ship_' + this.botIndex, 'bot_' + this.botIndex);
        ship.role = Role.BOT;
        ship.x = x;
        ship.y = y;
        const engineEntity = this.gameEngine.buildEngineEntity(ship);
        this.gameEngine.createMainEntity(engineEntity, true);
    }

    private intiateBotShips() {
        let positionX = 0, positionY = 0;
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const ship = ShipEntity.GetFreeShipStats('bot_ship_' + this.botIndex, 'bot_' + this.botIndex);
                ship.role = Role.BOT;
                ship.x = positionX;
                ship.y = positionY;
                const engineEntity = this.gameEngine.buildEngineEntity(ship);
                this.gameEngine.createMainEntity(engineEntity, true);

                positionX += 200;
                this.botIndex++;
            }
            positionX = 0;
            positionY += 300;
            this.botIndex++;
        }
    }

}