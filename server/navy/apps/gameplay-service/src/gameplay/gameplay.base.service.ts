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
    SocketClientMessageSync
} from "../ws/ws.protocol";
import { BaseGameplayInstance } from "./gameplay.base.instance";

export enum GameplayType {
    Battle,
    Island,
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

    private testInstanceX = 0;

    constructor() {
    }

    destroyEmptyInstancesIfNeeded() {
        const instancesToDelete: string[] = [];
        this.instances.forEach((instance) => {
            if (instance.destroyByTimeIfNeeded()) {
                instancesToDelete.push(instance.instanceId);
                this.sectorInstance.delete(instance.x + '+' + instance.y);
            }
        });
        Utils.DeleteKeysFromMap(this.instances, instancesToDelete);
        return instancesToDelete;
    }

    killInstance(instanceId: string) {
        const instance = this.instances.get(instanceId);
        if (instance) {
            if (instance.destroy(true)) {
                this.sectorInstance.delete(instance.x + '+' + instance.y);
                this.instances.delete(instanceId);
            }
        }
    }

    createTestInstance(sectorContent: SectorContent, addBots: boolean) {
        const x = this.testInstanceX++, y = 0;
        const instance = this.initiateGameplayInstance(x, y, sectorContent, true, addBots);
        if (instance) {
            this.instances.set(instance.instanceId, instance);
            this.sectorInstance.set(x + '+' + y, instance.instanceId);
        }
        return instance.instanceId;
    }

    hasInstance(instanceId: string) {
        return this.instances.has(instanceId);
    }

    getInstance(instanceId: string) {
        return this.instances.get(instanceId);
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

    getMaxLoopTime() {
        let maxTime = 0;
        this.instances.forEach((instance) => {
            if (instance.getRecentEngineLoopTime() > maxTime)
                maxTime = instance.getRecentEngineLoopTime();
        });
        return maxTime;
    }

    getAvgLoopTime() {
        let avgTime = 0;
        this.instances.forEach((instance) => {
            avgTime += instance.getRecentEngineLoopTime();
        });
        avgTime /= this.instances.size;
        return avgTime;
    }

}