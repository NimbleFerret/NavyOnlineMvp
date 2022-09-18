/* eslint-disable prettier/prettier */
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
    SocketClientMessageJoinGame,
    SocketClientMessageMove,
    SocketClientMessageSync,
    SocketServerMessageEntityMove,
    SocketServerMessageGameInit,
    SocketServerMessageRemoveEntity, SocketServerMessageSync, WsProtocol
} from 'src/ws/ws.protocol';
import {
    AppEvents,
    NotifyEachPlayerEventMsg,
    NotifyPlayerEventMsg,
    PlayerDisconnectedEvent
} from 'src/app.events';
import { BaseGameplayEntity } from './gameplay.base.entity';
import { GameplayType } from './gameplay.base.service';
import { Logger } from '@nestjs/common';

export abstract class BaseGameplayInstance {

    public readonly worldStateUpdateIntervalMS = 2000;
    public readonly instanceId = uuidv4();

    readonly playerEntityMap: Map<string, string> = new Map();
    readonly entityPlayerMap: Map<string, string> = new Map();
    notifyGameWorldStateTimer: NodeJS.Timer;

    constructor(public eventEmitter: EventEmitter2, public gameplayType: GameplayType, public gameEngine: any) {
    }

    // -------------------------------------
    // General
    // -------------------------------------

    addPlayer(playerId: string) {
        let engineEntity: any;
        if (this.gameplayType == GameplayType.Battle) {

            // As stands for HAXE:
            //
            // enum ShipHullSize {
            //     SMALL;
            //     MEDIUM;
            // }
            // enum ShipWindows {
            //     ONE;
            //     TWO;
            //     NONE;
            // }
            // enum ShipGuns {
            //     ONE;
            //     TWO;
            //     THREE;
            //     FOUR;
            // }

            // TODO Set specific params...
            engineEntity = this.gameEngine.createEntity('Player', 100, (this.playerEntityMap.size) * 500, 'SMALL', 'NONE', 'THREE', undefined, playerId);
        } else {
            engineEntity = this.gameEngine.createEntity(350, 290, undefined, playerId);
        }
        if (engineEntity) {
            this.playerEntityMap.set(engineEntity.ownerId, engineEntity.id);
            this.entityPlayerMap.set(engineEntity.id, engineEntity.ownerId);
            return engineEntity;
        } else {
            return undefined;
        }
    }

    public getPlayersCount() {
        return this.playerEntityMap.size;
    }

    notifyPlayer(playerId: string, message: object, event: string) {
        const notifyPlayerEventMsg = {
            playerId,
            socketEvent: event,
            message
        } as NotifyPlayerEventMsg;

        this.eventEmitter.emit(AppEvents.NotifyPlayer, notifyPlayerEventMsg);
    }

    notifyAllPlayers(message: object, event: string) {
        const notifyEachPlayerEventMsg = {
            instanceId: this.instanceId,
            socketEvent: event,
            message
        } as NotifyEachPlayerEventMsg;

        this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
    }

    destroy() {
        try {
            clearInterval(this.notifyGameWorldStateTimer);
            this.playerEntityMap.clear();
            this.entityPlayerMap.clear();
            this.gameEngine.destroy();
        } catch (e) {
            Logger.error(e);
        }
    }

    // -------------------------------------
    // Player input events
    // -------------------------------------

    async handlePlayerJoinedEvent(data: SocketClientMessageJoinGame) {
        this.addPlayer(data.playerId);

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

    async handlePlayerMove(data: SocketClientMessageMove) {
        const character = this.playerEntityMap.get(data.playerId);
        if (character) {
            if (data.up)
                this.gameEngine.entityMoveUp(character);
            if (data.down)
                this.gameEngine.entityMoveDown(character);
            if (data.left)
                this.gameEngine.entityMoveLeft(character);
            if (data.right)
                this.gameEngine.entityMoveRight(character);

            const socketServerMessageEntityMove = {
                entityId: character,
                up: data.up,
                down: data.down,
                left: data.left,
                right: data.right
            } as SocketServerMessageEntityMove;

            this.notifyAllPlayers(socketServerMessageEntityMove, WsProtocol.SocketServerEventEntityMove);
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
        const characters: BaseGameplayEntity[] = [];
        for (const [key, value] of this.gameEngine.mainEntityManager.entities) {
            characters.push(this.converJsEntityToTypeScript(value));
        }
        return characters;
    }

    public abstract converJsEntityToTypeScript(jsEntity: any): BaseGameplayEntity;
}