/* eslint-disable prettier/prettier */
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import {
    AppEvents,
    NotifyEachPlayerEventMsg,
    NotifyPlayerEventMsg,
    PlayerDisconnectedEvent
} from "../app.events";
import { Logger, OnModuleInit } from "@nestjs/common";
import {
    SocketClientMessageInput,
    SocketClientMessageJoinGame,
    SocketClientMessageLeaveGame,
    SocketClientMessageRespawn,
    SocketClientMessageSync,
    SocketServerMessageGameInit,
    WsProtocol
} from "./ws.protocol";

@WebSocketGateway({
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
})
export class WsGateway implements OnModuleInit {

    @WebSocketServer()
    server: Server;

    private static readonly ClientSockets = new Map<string, Socket>();
    private static readonly PlayerToInstance = new Map<string, string>();
    private static readonly InstanceSockets = new Map<string, Socket[]>();

    constructor(private eventEmitter: EventEmitter2) {
        // TODO handle ws disconnected event
        // TODO iterate sockets
    }

    onModuleInit() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        this.server.on('connection', (socket: Socket) => {
            socket.on('disconnect', function () {
                WsGateway.ClientSockets.forEach((v, k) => {
                    if (v == socket) {
                        Logger.log(k + ' disconnected');

                        const instanceId = WsGateway.PlayerToInstance.get(k);
                        if (instanceId) {
                            const sockets = WsGateway.InstanceSockets.get(instanceId);
                            if (sockets && sockets.length > 0) {
                                const index = sockets.indexOf(socket);
                                if (index !== -1) {
                                    sockets.splice(index, 1);
                                }
                            }
                        }

                        const event = {
                            playerId: k
                        } as PlayerDisconnectedEvent;

                        self.eventEmitter.emit(AppEvents.PlayerDisconnected, event);
                    }
                });
            });
        });
    }

    // -------------------------------------
    // WebSocket client message listeners
    // -------------------------------------

    @SubscribeMessage(WsProtocol.SocketClientEventPing)
    async ping(client: Socket) {
        client.emit(WsProtocol.SocketServerEventPong, {});
    }

    // TODO проверить владеет ли данный игрок указанным кораблем и авторизован ли
    @SubscribeMessage(WsProtocol.SocketClientEventJoinGame)
    async joinGame(client: Socket, data: SocketClientMessageJoinGame) {
        Logger.log(`Got joinGame request. ${JSON.stringify(data)}`);
        WsGateway.ClientSockets.set(data.playerId, client);
        this.eventEmitter.emit(AppEvents.PlayerJoinedInstance, data);
    }

    @SubscribeMessage(WsProtocol.SocketClientEventLeaveGame)
    async leaveGame(client: Socket, data: SocketClientMessageLeaveGame) {
        Logger.log(`Got leaveGame request. ${JSON.stringify(data)}`);
        const event = {
            playerId: data.playerId
        } as PlayerDisconnectedEvent;
        this.eventEmitter.emit(AppEvents.PlayerDisconnected, event);
    }

    @SubscribeMessage(WsProtocol.SocketClientEventInput)
    async input(@MessageBody() data: SocketClientMessageInput) {
        Logger.log(`Got input request. ${JSON.stringify(data)}`);
        this.eventEmitter.emit(AppEvents.PlayerInput, data);
    }

    @SubscribeMessage(WsProtocol.SocketClientEventSync)
    async sync(@MessageBody() data: SocketClientMessageSync) {
        Logger.log(`Got sync request. ${JSON.stringify(data)}`);
        this.eventEmitter.emit(AppEvents.PlayerSync, data);
    }

    @SubscribeMessage(WsProtocol.SocketClientEventRespawn)
    async respawn(@MessageBody() data: SocketClientMessageRespawn) {
        Logger.log(`Got respawn request. ${JSON.stringify(data)}`);
        this.eventEmitter.emit(AppEvents.PlayerRespawn, data);
    }

    // -------------------------------------
    // WebSocket clients notification
    // -------------------------------------

    @OnEvent(AppEvents.NotifyPlayer)
    async handleNotifyPlayerEvent(event: NotifyPlayerEventMsg) {
        const playerSocket = WsGateway.ClientSockets.get(event.playerId);
        if (playerSocket) {
            // Save each client socket for every game instance
            if (event.socketEvent == WsProtocol.SocketServerEventGameInit) {
                const initMesage = event.message as SocketServerMessageGameInit;

                let sockets = WsGateway.InstanceSockets.get(initMesage.instanceId);
                if (!sockets) {
                    sockets = [];
                }
                sockets.push(playerSocket);

                WsGateway.InstanceSockets.set(initMesage.instanceId, sockets);
                WsGateway.PlayerToInstance.set(event.playerId, initMesage.instanceId);
            }
            playerSocket.emit(event.socketEvent, event.message);
        } else {
            Logger.error(`Unable to notify player: ${event.playerId} event: ${event.socketEvent}`);
        }
    }

    @OnEvent(AppEvents.NotifyEachPlayer)
    async handleNotifyEachPlayerEvent(event: NotifyEachPlayerEventMsg) {
        let sockets = WsGateway.InstanceSockets.get(event.instanceId);
        if (sockets) {
            if (event.exceptPlayer) {
                sockets = sockets.filter(socket => socket != WsGateway.ClientSockets.get(event.exceptPlayer));
            }
            sockets.forEach(socket => {
                socket.emit(event.socketEvent, event.message);
            });
        }
    }

}