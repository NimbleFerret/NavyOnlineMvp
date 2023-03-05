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
    SocketServerMessageEntityInput,
    PlayerInputType
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
    notifyGameWorldStateTimer: NodeJS.Timer;

    constructor(
        public eventEmitter: EventEmitter2,
        public gameplayType: GameplayType,
        public gameEngine: any,
        public x: number,
        public y: number) {
        switch (gameplayType) {
            case GameplayType.BattleTest:
                this.instanceId = Constants.BATTLE_TEST_INSTANCE_ID;
                break;
            case GameplayType.IslandTest:
                this.instanceId = Constants.ISLAND_TEST_INSTANCE_ID;
                break;
            default:
                this.instanceId = uuidv4();
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

    public destroy() {
        if (this.ifTestInstance()) {
            return false;
        }
        try {
            clearInterval(this.notifyGameWorldStateTimer);
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
            this.gameEngine.addInputCommand({
                index: data.index,
                inputType: data.playerInputType,
                playerId: data.playerId,
                shootDetails: data.shootDetails
            });

            // Only basic movement notification inside basic instance logic
            if (data.playerInputType != PlayerInputType.SHOOT) {
                const socketServerMessageEntityInput = {
                    playerId: data.playerId,
                    playerInputType: data.playerInputType
                } as SocketServerMessageEntityInput;
                this.notifyAllPlayers(socketServerMessageEntityInput, WsProtocol.SocketServerEventEntityInput, data.playerId);
            }
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

    private collectEntities() {
        const entities: BaseGameObject[] = [];
        for (const [key, value] of this.gameEngine.mainEntityManager.entities) {
            entities.push(this.converJsEntityToTypeScript(value));
        }
        return entities;
    }

    public abstract converJsEntityToTypeScript(jsEntity: any): BaseGameObject;
}