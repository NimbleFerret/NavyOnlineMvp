import { SectorContent } from "@app/shared-library/gprc/grpc.world.service";
import { Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import {
    AppEvents,
    PlayerDisconnectedEvent
} from "../app.events";
import {
    SocketClientMessageJoinGame,
    SocketClientMessageMove,
    SocketClientMessageSync
} from "../ws/ws.protocol";
import { BaseGameplayInstance } from "./gameplay.base.instance";

export enum GameplayType {
    Battle,
    Island
}

export interface JoinWorldOrCreateResult {
    result: boolean;
    playersCount?: number;
    instanceId?: string;
    reason?: string;
}

export abstract class GameplayBaseService {
    readonly maxPlayersPerInstance = 10;
    readonly instances = new Map<string, BaseGameplayInstance>();
    readonly sectorInstance = new Map<string, string>();
    readonly playerInstanceMap = new Map<string, string>();

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
                result.playersCount = islandInstance.getPlayersCount();
                result.instanceId = islandInstance.instanceId;
            } else {
                result.result = false;
                result.reason = 'Sector is full';
            }
        } else {
            const instance = this.initiateGameplayInstance(x, y, sectorContent);
            if (instance) {
                this.instances.set(instance.instanceId, instance);
                this.sectorInstance.set(x + '+' + y, instance.instanceId);
                result.result = true;
                result.playersCount = instance.getPlayersCount();
                result.instanceId = instance.instanceId;
            }
        }

        return result;
    }

    public abstract initiateGameplayInstance(x: number, y: number, sectorContent: SectorContent): BaseGameplayInstance;

    // -------------------------------------
    // Admin api
    // -------------------------------------

    destroyEmptyInstances() {
        const instancedToDelete: string[] = [];
        this.instances.forEach((v) => {
            if (v.getPlayersCount() == 0) {
                v.destroy();
                instancedToDelete.push(v.instanceId);
            }
        });
        instancedToDelete.forEach((f) => {
            this.instances.delete(f);
        });
    }

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

    @OnEvent(AppEvents.PlayerJoinedInstance)
    async handlePlayerJoinedEvent(data: SocketClientMessageJoinGame) {
        if (!this.playerInstanceMap.has(data.playerId.toLowerCase())) {
            const islandInstance = this.instances.get(data.instanceId);
            if (islandInstance) {
                await islandInstance.handlePlayerJoinedEvent(data);
                this.playerInstanceMap.set(data.playerId.toLowerCase(), data.instanceId);
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
        const instanceId = this.playerInstanceMap.get(data.playerId.toLowerCase());
        if (instanceId) {
            this.playerInstanceMap.delete(data.playerId.toLowerCase());
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
        const instanceId = this.playerInstanceMap.get(data.playerId.toLowerCase());
        if (instanceId) {
            const instance = this.instances.get(instanceId);
            instance.handlePlayerMove(data);
        } else {
            // TODO add logs
        }
    }

    @OnEvent(AppEvents.PlayerSync)
    async handlePlayerSync(data: SocketClientMessageSync) {
        const instanceId = this.playerInstanceMap.get(data.playerId.toLowerCase());
        if (instanceId) {
            const gameInstance = this.instances.get(instanceId);
            gameInstance.handlePlayerSync(data);
        } else {
            // TODO add logs
        }
    }

}