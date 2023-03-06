import { InstanceDetails } from "@app/shared-library/gprc/grpc.gameplay-balancer.service";
import { SectorContent } from "@app/shared-library/gprc/grpc.world.service";
import { Utils } from "@app/shared-library/utils";
import { Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import {
    AppEvents,
    PlayerDisconnectedEvent
} from "../app.events";
import {
    SocketClientMessageInput,
    SocketClientMessageJoinGame,
    // SocketClientMessageMove,
    SocketClientMessageSync
} from "../ws/ws.protocol";
import { BaseGameplayInstance } from "./gameplay.base.instance";

export enum GameplayType {
    Battle,
    BattleTest,
    Island,
    IslandTest
}

export interface JoinWorldOrCreateResult {
    result: boolean;
    instanceId?: string;
    reason?: string;
}

export abstract class GameplayBaseService {
    readonly maxPlayersPerInstance = 10;
    readonly instances = new Map<string, BaseGameplayInstance>();
    readonly sectorInstance = new Map<string, string>();
    playerInstanceMap = new Map<string, string>();

    private testInstanceX = 0;

    constructor() {
    }

    destroyEmptyInstancesIfNeeded() {
        const instancedToDelete: string[] = [];
        this.instances.forEach((instance) => {
            if (instance.destroyByTimeIfNeeded()) {
                instancedToDelete.push(instance.instanceId);
                this.sectorInstance.delete(instance.x + '+' + instance.y);
            }
        });
        Utils.DeleteKeysFromMap(this.instances, instancedToDelete);
    }

    async killInstance(instanceId: string) {
        const instance = this.instances.get(instanceId);
        if (instance) {
            instance.destroy();
        }
    }

    createTestInstance(addBots: boolean) {
        const x = this.testInstanceX++, y = 0;
        const instance = this.initiateGameplayInstance(x, y, SectorContent.SECTOR_CONTENT_EMPTY, true, addBots);
        if (instance) {
            this.instances.set(instance.instanceId, instance);
            this.sectorInstance.set(x + '+' + y, instance.instanceId);
        }
        return instance.instanceId;
    }

    // -------------------------------------
    // World managed api
    // -------------------------------------

    joinWorldOrCreate(x: number, y: number, sectorContent: SectorContent) {
        const result: JoinWorldOrCreateResult = {
            result: false
        };
        const islandInstanceId = this.sectorInstance.get(x + '+' + y);

        if (islandInstanceId) {
            const islandInstance = this.instances.get(islandInstanceId);
            if (islandInstance.getPlayersCount() < this.maxPlayersPerInstance) {
                result.result = true;
                result.instanceId = islandInstance.instanceId;
            } else {
                result.result = false;
                result.reason = 'Sector is full';
            }
        } else {
            const instance = this.initiateGameplayInstance(x, y, sectorContent, false, false);
            if (instance) {
                this.instances.set(instance.instanceId, instance);
                this.sectorInstance.set(x + '+' + y, instance.instanceId);
                result.result = true;
                result.instanceId = instance.instanceId;
            }
        }

        return result;
    }

    public abstract initiateGameplayInstance(x: number, y: number, sectorContent: SectorContent, testInstance: boolean, defaultBots: boolean): BaseGameplayInstance;

    // -------------------------------------
    // Admin api
    // -------------------------------------

    getInstancesInfo() {
        const result: InstanceDetails[] = [];
        this.instances.forEach((instance) => {
            result.push({
                id: instance.instanceId,
                players: instance.getPlayersCount(),
                totalEntities: instance.getEntitiesCount(),
                x: instance.x,
                y: instance.y
            } as InstanceDetails);
        });
        return result;
    }

    getInstancesCount() {
        return this.instances.size;
    }

    getEntitiesCount() {
        let count = 0;
        this.instances.forEach((instance) => {
            count += instance.getEntitiesCount();
        });
        return count;
    }

    getAvgLoopTime() {
        let avgTime = 0;
        this.instances.forEach((instance) => {
            avgTime += instance.getRecentEngineLoopTime();
        });
        avgTime /= this.instances.size;
        return avgTime;
    }

    // -------------------------------------
    // Client events from WebSocket
    // ------------------------------------- 

    @OnEvent(AppEvents.PlayerJoinedInstance)
    async handlePlayerJoinedEvent(data: SocketClientMessageJoinGame) {
        if (this.instances.size > 0) {
            if (!this.playerInstanceMap.has(data.playerId.toLowerCase())) {
                const instance = this.instances.get(data.instanceId);
                if (instance) {
                    await instance.handlePlayerJoinedEvent(data);
                    this.playerInstanceMap.set(data.playerId.toLowerCase(), data.instanceId);
                    Logger.log(`Player: ${data.playerId} was added to the existing instance: ${data.instanceId}`);
                } else {
                    // Commented becasuse both island and battle gameplay has the same logic  
                    Logger.error(`Unable to add player into any game instance. Players: ${this.playerInstanceMap.size}, Instances: ${this.instances.size}`);
                }
            } else {
                // Commented becasuse both island and battle gameplay has the same logic  
                Logger.error('Player cant join more than once');
            }
        }
    }

    @OnEvent(AppEvents.PlayerDisconnected)
    async handlePlayerDisconnected(data: PlayerDisconnectedEvent) {
        const playerId = data.playerId.toLowerCase();
        const instanceId = this.playerInstanceMap.get(playerId);
        if (instanceId) {
            this.playerInstanceMap.delete(playerId);
            const instance = this.instances.get(instanceId);
            instance.handlePlayerDisconnected(data);
            if (instance.getPlayersCount() == 0 && instance.destroy()) {
                Logger.log(`No more players in instance: ${instanceId}, destroying...`);
                this.instances.delete(instanceId);
                this.sectorInstance.delete(instance.x + '+' + instance.y);
                Logger.log(`Instance: ${instanceId} destroyed !`);
            }
        } else {
            Logger.error('Unable to delete instance while player disconnected. Player id: ' + playerId);
        }
    }

    @OnEvent(AppEvents.PlayerInput)
    async handlePlayerInput(data: SocketClientMessageInput) {
        const instanceId = this.playerInstanceMap.get(data.playerId.toLowerCase());
        if (instanceId) {
            const instance = this.instances.get(instanceId);
            await instance.handlePlayerInput(data);
        } else {
            // Logger.error(`Unable to handlePlayerMove, instanceId:${instanceId}, playerId:${data.playerId.toLowerCase()}`);
        }
    }

    @OnEvent(AppEvents.PlayerSync)
    async handlePlayerSync(data: SocketClientMessageSync) {
        const instanceId = this.playerInstanceMap.get(data.playerId.toLowerCase());
        if (instanceId) {
            const gameInstance = this.instances.get(instanceId);
            gameInstance.handlePlayerSync(data);
        } else {
            // Logger.error(`Unable to handlePlayerSync, instanceId:${instanceId}, playerId:${data.playerId.toLowerCase()}`);
        }
    }

}