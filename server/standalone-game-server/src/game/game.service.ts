/* eslint-disable prettier/prettier */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
    AppEvents,
    PlayerDisconnectedEvent
} from '../app.events';
import { GameInstance } from './game.instance';
import {
    SocketClientMessageJoinGame,
    SocketClientMessageMove,
    SocketServerMessageShipShoot,
} from 'src/ws/ws.protocol';


@Injectable()
export class GameService implements OnModuleInit {

    private readonly maxPlayersPerInstance = 10;
    private readonly gameInstances = new Map<string, GameInstance>();
    private readonly playerInstaneMap = new Map<string, string>();

    constructor(private eventEmitter: EventEmitter2) {
    }

    async onModuleInit() {
        console.log();
    }

    @OnEvent(AppEvents.PlayerJoined)
    async handlePlayerJoinedEvent(data: SocketClientMessageJoinGame) {
        // Create a new instance and add player into it
        if (!this.playerInstaneMap.has(data.playerId)) {
            if (this.gameInstances.size == 0) {
                const gameInstance = new GameInstance(this.eventEmitter);
                gameInstance.handlePlayerJoinedEvent(data);

                this.gameInstances.set(gameInstance.instanceId, gameInstance);
                this.playerInstaneMap.set(data.playerId, gameInstance.instanceId);

                Logger.log(`Player: ${data.playerId} was added to the new instance: ${gameInstance.instanceId}`);
            } else {
                // Populate each instance one by one
                let gameInstance: GameInstance;

                this.gameInstances.forEach((v) => {
                    if (!gameInstance) {
                        if (v.getPlayersCount() < this.maxPlayersPerInstance) {
                            gameInstance = v;
                        }
                    }
                });

                if (gameInstance) {
                    gameInstance.handlePlayerJoinedEvent(data);
                    this.playerInstaneMap.set(data.playerId, gameInstance.instanceId);
                    Logger.log(`Player: ${data.playerId} was added to the existing instance: ${gameInstance.instanceId}`);
                } else {
                    Logger.error(`Unable to add player into any game instance. Players: ${this.playerInstaneMap.size}, Instances: ${this.gameInstances.size}`);
                }
            }
        } else {
            // TODO add logs
        }
    }

    @OnEvent(AppEvents.PlayerDisconnected)
    async handlePlayerDisconnected(data: PlayerDisconnectedEvent) {
        const instanceId = this.playerInstaneMap.get(data.playerId);
        if (instanceId) {
            const gameInstance = this.gameInstances.get(instanceId);
            gameInstance.handlePlayerDisconnected(data);
            if (gameInstance.getPlayersCount() == 0) {
                gameInstance.destroy();
                this.gameInstances.delete(instanceId);
            }
        } else {
            // TODO add logs
        }
    }

    @OnEvent(AppEvents.PlayerMove)
    async handlePlayerMove(data: SocketClientMessageMove) {
        const instanceId = this.playerInstaneMap.get(data.playerId);
        if (instanceId) {
            const gameInstance = this.gameInstances.get(instanceId);
            gameInstance.handlePlayerMove(data);
        } else {
            // TODO add logs
        }
    }

    @OnEvent(AppEvents.PlayerShoot)
    async handlePlayerShoot(data: SocketServerMessageShipShoot) {
        const instanceId = this.playerInstaneMap.get(data.playerId);
        if (instanceId) {
            const gameInstance = this.gameInstances.get(instanceId);
            gameInstance.handlePlayerShoot(data);
        } else {
            // TODO add logs
        }
    }

}
