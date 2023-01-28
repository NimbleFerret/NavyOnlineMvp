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

        // TODO players capacity per instance check

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
            const instance = this.initiateGameplayInstance(x, y, sectorContent);
            if (instance) {
                this.instances.set(instance.instanceId, instance);
                this.sectorInstance.set(x + '+' + y, instance.instanceId);
                result.result = true;
                result.instanceId = instance.instanceId;
            }
        }

        return result;
    }

    public abstract initiateGameplayInstance(x: number, y: number, sectorContent: SectorContent): BaseGameplayInstance;

    // -------------------------------------
    // Admin api
    // -------------------------------------

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

    getInstancesInfo() {
        const result: InstanceDetails[] = [];
        this.instances.forEach((inatance) => {
            result.push({
                id: inatance.instanceId,
                players: inatance.getPlayersCount(),
                bots: 0,
                x: inatance.x,
                y: inatance.y
            } as InstanceDetails);
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
        const playerId = data.playerId.toLowerCase();
        const instanceId = this.playerInstanceMap.get(playerId);
        if (instanceId) {
            this.playerInstanceMap.delete(playerId);
            const instance = this.instances.get(instanceId);
            instance.handlePlayerDisconnected(data);
            if (instance.getPlayersCount() == 0) {
                Logger.log(`No more players in instance: ${instanceId}, destroying...`);
                instance.destroy();
                this.instances.delete(instanceId);
                this.sectorInstance.delete(instance.x + '+' + instance.y);
                Logger.log(`Instance: ${instanceId} destroyed !`);
            }
        } else {
            Logger.error('Unable to delete instance while player disconnected. Player id: ' + playerId);
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