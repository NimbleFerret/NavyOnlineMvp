/* eslint-disable prettier/prettier */

import { Logger } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AppEvents, PlayerDisconnectedEvent } from "src/app.events";
import { Ship, ShipDocument } from "src/asset/asset.ship.entity";
import {
    SectorContent,
    SocketClientMessageJoinGame,
    SocketClientMessageMove,
    SocketClientMessageSync
} from "src/ws/ws.protocol";
import { GameplayBattleInstance } from "./battle/gameplay.battle.instance";
import { BaseGameplayInstance } from "./gameplay.base.instance";
import { GameplayIslandInstance } from "./island/gameplay.island.instance";

export enum GameplayType {
    Battle,
    Island
}

export abstract class GameplayBaseService {
    readonly maxPlayersPerInstance = 10;
    readonly instances = new Map<string, BaseGameplayInstance>();
    readonly sectorInstance = new Map<string, string>();
    readonly playerInstanceMap = new Map<string, string>();

    constructor(
        @InjectModel(Ship.name) private shipModel: Model<ShipDocument>,
        public eventEmitter: EventEmitter2,
        private gameplayType: GameplayType) {
    }

    // -------------------------------------
    // World managed api
    // -------------------------------------

    joinWorldOrCreate(x: number, y: number, sectorContent: SectorContent) {
        const islandInstanceId = this.sectorInstance.get(x + '+' + y);
        if (islandInstanceId) {
            const islandInstance = this.instances.get(islandInstanceId);
            if (islandInstance.getPlayersCount() < this.maxPlayersPerInstance) {
                return {
                    result: true,
                    playersCount: islandInstance.getPlayersCount(),
                    instanceId: islandInstance.instanceId
                }
            } else {
                return {
                    result: false,
                    reason: 'Sector is full'
                }
            }
        } else {
            let instance: BaseGameplayInstance;
            if (this.gameplayType == GameplayType.Island) {
                instance = new GameplayIslandInstance(this.eventEmitter, x, y);
            } else {
                instance = new GameplayBattleInstance(this.shipModel, this.eventEmitter, x, y, sectorContent);
            }
            if (instance) {
                this.instances.set(instance.instanceId, instance);
                this.sectorInstance.set(x + '+' + y, instance.instanceId);
                return {
                    result: true,
                    playersCount: instance.getPlayersCount(),
                    instanceId: instance.instanceId
                }
            } else {
                return {
                    result: false
                }
            }
        }
    }

    // -------------------------------------
    // Admin api
    // -------------------------------------

    getInstancesInfo() {
        const result = [];
        this.instances.forEach((v) => {
            result.push({
                id: v.instanceId,
                players: v.getPlayersCount()
            });
        });
        return result;
    }

    // -------------------------------------
    // Client events from WebSocket
    // ------------------------------------- 

    // TODO handle instance type here
    @OnEvent(AppEvents.PlayerJoinedInstance)
    async handlePlayerJoinedEvent(data: SocketClientMessageJoinGame) {
        if (!this.playerInstanceMap.has(data.playerId)) {
            const islandInstance = this.instances.get(data.instanceId);
            if (islandInstance) {
                islandInstance.handlePlayerJoinedEvent(data);
                this.playerInstanceMap.set(data.playerId, data.instanceId);
                Logger.log(`Player: ${data.playerId} was added to the existing instance: ${data.instanceId}`);
            } else {
                // Commented becasuse both island and battle gameplay has the same logic  
                // Logger.error(`Unable to add player into any game instance. Players: ${this.playerInstanceMap.size}, Instances: ${this.instances.size}`);
            }
        } else {
            // Commented becasuse both island and battle gameplay has the same logic  
            // Logger.error('Player cant join more than once');
        }
    }

    @OnEvent(AppEvents.PlayerDisconnected)
    async handlePlayerDisconnected(data: PlayerDisconnectedEvent) {
        const instanceId = this.playerInstanceMap.get(data.playerId);
        if (instanceId) {
            this.playerInstanceMap.delete(data.playerId);
            const instance = this.instances.get(instanceId);
            instance.handlePlayerDisconnected(data);
            if (instance.getPlayersCount() == 0) {
                Logger.log(`No more player in instance: ${instanceId}, destroying...`);
                instance.destroy();
                this.instances.delete(instanceId);

                let sectorKeyToDelete: string;
                this.sectorInstance.forEach((v, k) => {
                    if (v == instanceId) {
                        sectorKeyToDelete = k;
                    }
                });
                this.sectorInstance.delete(sectorKeyToDelete);
                Logger.log(`Instance: ${instanceId} destroyed !`);
            }
        } else {
            // TODO add logs
        }
    }

    @OnEvent(AppEvents.PlayerMove)
    async handlePlayerMove(data: SocketClientMessageMove) {
        const instanceId = this.playerInstanceMap.get(data.playerId);
        if (instanceId) {
            const instance = this.instances.get(instanceId);
            instance.handlePlayerMove(data);
        } else {
            // TODO add logs
        }
    }

    @OnEvent(AppEvents.PlayerSync)
    async handlePlayerSync(data: SocketClientMessageSync) {
        const instanceId = this.playerInstanceMap.get(data.playerId);
        if (instanceId) {
            const gameInstance = this.instances.get(instanceId);
            gameInstance.handlePlayerSync(data);
        } else {
            // TODO add logs
        }
    }

}