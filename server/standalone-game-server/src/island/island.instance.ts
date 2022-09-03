/* eslint-disable prettier/prettier */
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { engine } from "../../IslandEngine.js"
import {
    SocketClientMessageJoinGame,
    SocketClientMessageMove,
    SocketServerMessageAddEntity,
    SocketServerMessageEntityMove,
    SocketServerMessageGameInit,
    SocketServerMessageRemoveEntity,
    SocketServerMessageUpdateWorldState,
    WsProtocol
} from 'src/ws/ws.protocol';
import {
    AppEvents,
    NotifyEachPlayerEventMsg,
    NotifyPlayerEventMsg,
    PlayerDisconnectedEvent
} from 'src/app.events';
import { EntityCharacter } from './entity/entity.character';
import { Logger } from '@nestjs/common';

// TODO refactor both island and game instances as it has lots of shared logic
export class IslandInstance {

    public readonly worldStateUpdateIntervalMS = 2000;
    public readonly instanceId = uuidv4();

    private readonly playerCharacterMap: Map<string, string> = new Map();
    private readonly gameEngine: engine.IslandEngine;
    private notifyGameWorldStateTimer: NodeJS.Timer;

    constructor(private eventEmitter: EventEmitter2, public worldX: number, public worldY: number) {

        this.gameEngine = new engine.IslandEngine();
        this.notifyGameWorldStateTimer = setInterval(() => this.notifyGameWorldState(), this.worldStateUpdateIntervalMS);

        console.log(this.gameEngine);

        this.gameEngine.tickCallback = () => {
            // Send only short info
        };

        this.gameEngine.createCharacterCallback = (character: object) => {
            const socketServerMessageAddEntity = {
                character: this.converJsCharacterToTypeScript(character)
            } as SocketServerMessageAddEntity;
            this.notifyAllPlayers(socketServerMessageAddEntity, WsProtocol.SocketServerEventAddEntity);
        };

        this.gameEngine.deleteCharacterCallback = (character: object) => {
            const jsCharacter = this.converJsCharacterToTypeScript(character);

            if (this.playerCharacterMap.has(jsCharacter.ownerId)) {
                this.playerCharacterMap.delete(jsCharacter.ownerId);
            }

            const socketServerMessageRemoveEntity = {
                entityId: jsCharacter.id
            } as SocketServerMessageRemoveEntity;

            const notifyEachPlayerEventMsg = {
                socketEvent: WsProtocol.SocketServerEventRemoveEntity,
                message: socketServerMessageRemoveEntity
            } as NotifyEachPlayerEventMsg;

            this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
        };

    }

    private notifyGameWorldState() {
        if (this.playerCharacterMap.size > 0) {
            const socketServerMessageUpdateWorldState = {
                tick: this.gameEngine.tick,
                characters: this.collectCharacters()
            } as SocketServerMessageUpdateWorldState;

            this.notifyAllPlayers(socketServerMessageUpdateWorldState, WsProtocol.SocketServerEventUpdateWorldState);
        }
    }

    public getPlayersCount() {
        return this.playerCharacterMap.size;
    }

    public destroy() {
        try {
            clearInterval(this.notifyGameWorldStateTimer);
            this.playerCharacterMap.clear();
            this.gameEngine.destroy();
        } catch (e) {
            Logger.error(e);
        }
    }

    // -------------------------------------
    // General
    // -------------------------------------

    private addPlayer(playerId: string) {
        const character = this.converJsCharacterToTypeScript(this.gameEngine.createCharacter(350, 290, undefined, playerId));
        this.playerCharacterMap.set(character.ownerId, character.id);
        return character;
    }

    private notifyPlayer(playerId: string, message: object, event: string) {
        const notifyPlayerEventMsg = {
            playerId,
            socketEvent: event,
            message
        } as NotifyPlayerEventMsg;

        this.eventEmitter.emit(AppEvents.NotifyPlayer, notifyPlayerEventMsg);
    }

    private notifyAllPlayers(message: object, event: string) {
        const notifyEachPlayerEventMsg = {
            instanceId: this.instanceId,
            socketEvent: event,
            message
        } as NotifyEachPlayerEventMsg;

        this.eventEmitter.emit(AppEvents.NotifyEachPlayer, notifyEachPlayerEventMsg);
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
            characters: this.collectCharacters()
        } as SocketServerMessageGameInit;

        this.notifyPlayer(data.playerId, socketServerMessageGameInit, WsProtocol.SocketServerEventGameInit);
    }

    async handlePlayerDisconnected(data: PlayerDisconnectedEvent) {
        const character = this.playerCharacterMap.get(data.playerId);
        if (character) {
            this.playerCharacterMap.delete(data.playerId);
            this.gameEngine.removeCharacter(character);

            const socketServerMessageRemoveEntity = {
                entityId: character,
            } as SocketServerMessageRemoveEntity;

            this.notifyAllPlayers(socketServerMessageRemoveEntity, WsProtocol.SocketServerEventRemoveEntity);
        }
    }

    async handlePlayerMove(data: SocketClientMessageMove) {
        const character = this.playerCharacterMap.get(data.playerId);
        if (character) {
            if (data.up)
                this.gameEngine.characterMoveUp(character);
            if (data.down)
                this.gameEngine.characterMoveDown(character);
            if (data.left)
                this.gameEngine.characterMoveLeft(character);
            if (data.right)
                this.gameEngine.characterMoveRight(character);

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

    // -------------------------------------
    // Data preparation
    // -------------------------------------

    private collectCharacters() {
        const characters: EntityCharacter[] = [];
        for (const [key, value] of this.gameEngine.characterManager.entities) {
            characters.push(this.converJsCharacterToTypeScript(value));
        }
        return characters;
    }

    private converJsCharacterToTypeScript(jsCharacter: any) {
        const result = {
            y: jsCharacter.y,
            x: jsCharacter.x,
            id: jsCharacter.id,
            ownerId: jsCharacter.ownerId
        } as EntityCharacter;
        return result;
    }

}