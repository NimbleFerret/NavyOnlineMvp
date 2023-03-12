import { v4 as uuidv4 } from 'uuid';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameplayType } from './gameplay.base.service';
import { Logger } from '@nestjs/common';
import {
    NotifyPlayerEventMsg,
    AppEvents,
    NotifyEachPlayerEventMsg,
    PlayerDisconnectedEvent
} from '../app.events';
import {
    SocketClientMessageJoinGame,
    SocketServerMessageGameInit,
    WsProtocol,
    SocketServerMessageRemoveEntity,
    SocketClientMessageSync,
    SocketServerMessageSync,
    SocketClientMessageInput,
    SocketServerMessageEntityInputs,
    SocketServerMessageUpdateWorldState
} from '../ws/ws.protocol';
import { BaseGameObject } from '@app/shared-library/entities/entity.base';
import { Constants } from '../app.constants';

export abstract class BaseGameplayInstance {

    public readonly destroyEmptyInstanceTimeoutMS = 10000;
    public readonly worldStateUpdateIntervalMS = 2000;
    public readonly instanceId: string;

    readonly creationTime = new Date().getTime();
    readonly playerEntityMap = new Map<string, string>();
    readonly entityPlayerMap = new Map<string, string>();

    private readonly forcedStateUpdateIntervalTicks = 10;
    private ticksSinceLastForcedUpdate = 0;

    constructor(
        public eventEmitter: EventEmitter2,
        public gameplayType: GameplayType,
        public gameEngine: any,
        public x: number,
        public y: number) {
        switch (gameplayType) {
            case GameplayType.BattleTest:
                if (x == 0 && y == 0) {
                    this.instanceId = Constants.BATTLE_TEST_INSTANCE_ID;
                } else {
                    this.instanceId = uuidv4();
                }
                break;
            case GameplayType.IslandTest:
                this.instanceId = Constants.ISLAND_TEST_INSTANCE_ID;
                break;
            default:
                this.instanceId = uuidv4();
        }

        gameEngine.postLoopCallback = () => {
            if (this.getPlayersCount()) {
                // Replicate inputs
                if (gameEngine.validatedInputCommands.length > 0) {
                    const socketServerMessageShipInputs = {
                        tick: gameEngine.tick,
                        inputs: gameEngine.validatedInputCommands
                    } as SocketServerMessageEntityInputs;
                    this.notifyAllPlayers(socketServerMessageShipInputs, WsProtocol.SocketServerEventEntityInputs);
                }

                // Replicate world state if it is changed
                const socketServerMessageUpdateWorldState = {
                    tick: gameEngine.tick,
                    entities: this.collectChangedEntities()
                } as SocketServerMessageUpdateWorldState;
                if (socketServerMessageUpdateWorldState.entities.length > 0) {
                    this.notifyAllPlayers(socketServerMessageUpdateWorldState, WsProtocol.SocketServerEventUpdateWorldState);
                }

                // World state control info 
                if (this.ticksSinceLastForcedUpdate == this.forcedStateUpdateIntervalTicks) {
                    this.ticksSinceLastForcedUpdate = 0;
                    const socketServerMessageUpdateWorldState = {
                        tick: gameEngine.tick,
                        entities: this.collectEntities(false),
                        forced: true
                    } as SocketServerMessageUpdateWorldState;
                    this.notifyAllPlayers(socketServerMessageUpdateWorldState, WsProtocol.SocketServerEventUpdateWorldState);
                }

                this.ticksSinceLastForcedUpdate++;
            };
        }
    }

    // -------------------------------------
    // Abstract
    // -------------------------------------

    public abstract initiateEngineEntity(playerId: string, entityid: string): any;

    // -------------------------------------
    // General
    // -------------------------------------

    async addPlayer(playerId: string, entityid: string) {
        const engineEntity = this.initiateEngineEntity(playerId, entityid);
        if (engineEntity) {
            this.playerEntityMap.set(playerId, entityid);
            this.entityPlayerMap.set(entityid, playerId);
            return engineEntity;
        } else {
            return undefined;
        }
    }

    public getPlayersCount() {
        return this.playerEntityMap.size;
    }

    public getEntitiesCount() {
        return this.gameEngine.mainEntityManager.entities.size;
    }

    public getRecentEngineLoopTime() {
        return this.gameEngine.recentEngineLoopTime;
    }

    protected notifyPlayer(playerId: string, message: object, event: string) {
        const notifyPlayerEventMsg = {
            playerId,
            socketEvent: event,
            message
        } as NotifyPlayerEventMsg;

        this.eventEmitter.emit(AppEvents.NotifyPlayer, notifyPlayerEventMsg);
    }

    protected notifyAllPlayers(message: object, event: string, exceptPlayer?: string) {
        const notifyEachPlayerEventMsg = {
            instanceId: this.instanceId,
            socketEvent: event,
            message,
            exceptPlayer
        } as NotifyEachPlayerEventMsg;

        this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
    }

    public destroyByTimeIfNeeded() {
        const now = new Date().getTime();
        if (this.creationTime + this.destroyEmptyInstanceTimeoutMS < now && this.getPlayersCount() == 0) {
            return this.destroy();
        }
        return false;
    }

    public destroy(forced: boolean = false) {
        if (this.ifTestInstance() && !forced) {
            return false;
        }
        try {
            this.playerEntityMap.clear();
            this.entityPlayerMap.clear();
            this.gameEngine.destroy();
            Logger.log('Destroy instance. Type: ' + GameplayType[this.gameplayType] + ', id: ' + this.instanceId);
            return true;
        } catch (e) {
            Logger.error(e);
        }
        return false;
    }

    private ifTestInstance() {
        return this.gameplayType == GameplayType.BattleTest || this.gameplayType == GameplayType.IslandTest;
    }

    // -------------------------------------
    // Player input events
    // -------------------------------------

    async handlePlayerJoinedEvent(data: SocketClientMessageJoinGame) {
        await this.addPlayer(data.playerId, data.entityId);

        const socketServerMessageGameInit = {
            instanceId: this.instanceId,
            tickRate: this.gameEngine.gameLoop.targetFps,
            worldStateSyncInterval: this.worldStateUpdateIntervalMS,
            entities: this.collectEntities()
        } as SocketServerMessageGameInit;

        this.notifyPlayer(data.playerId, socketServerMessageGameInit, WsProtocol.SocketServerEventGameInit);
    }

    async handlePlayerDisconnected(data: PlayerDisconnectedEvent) {
        const entity = this.playerEntityMap.get(data.playerId);
        if (entity) {
            this.playerEntityMap.delete(data.playerId);
            this.entityPlayerMap.delete(entity);
            this.gameEngine.removeMainEntity(entity);

            const socketServerMessageRemoveEntity = {
                entityId: entity,
            } as SocketServerMessageRemoveEntity;

            this.notifyAllPlayers(socketServerMessageRemoveEntity, WsProtocol.SocketServerEventRemoveEntity);
        }
    }

    async handlePlayerInput(data: SocketClientMessageInput) {
        const playerEntityId = this.playerEntityMap.get(data.playerId);
        if (playerEntityId) {
            this.gameEngine.applyPlayerInput(data.playerInputType, data.playerId, data.index, data.shootDetails);
        }
    }

    async handlePlayerSync(data: SocketClientMessageSync) {
        const ship = this.playerEntityMap.get(data.playerId);
        if (ship) {
            const socketServerMessageSync = {
                entities: this.collectEntities()
            } as SocketServerMessageSync;
            this.notifyPlayer(data.playerId, socketServerMessageSync, WsProtocol.SocketServerEventSync);
        }
    }

    // -------------------------------------
    // Data preparation
    // -------------------------------------

    protected collectEntities(full: boolean = true) {
        const entities: BaseGameObject[] = [];
        for (const [key, value] of this.gameEngine.mainEntityManager.entities) {
            entities.push(this.converJsEntityToTypeScript(value, full));
        }
        return entities;
    }

    private collectChangedEntities() {
        const entities: BaseGameObject[] = [];
        for (const entity of this.gameEngine.mainEntityManager.getChangedEntities()) {
            entities.push(this.converJsEntityToTypeScript(entity, false));
        }
        return entities;
    }

    public abstract converJsEntityToTypeScript(jsEntity: any, full: boolean): BaseGameObject;
}