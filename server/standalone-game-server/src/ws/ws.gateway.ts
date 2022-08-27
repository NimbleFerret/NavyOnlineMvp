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
    SocketClientMessageJoinGame,
    SocketClientMessageMove,
    SocketClientMessageShoot,
    SocketServerMessageGameInit,
    WsProtocol
} from "./ws.protocol";

@WebSocketGateway({
    cors: {
        origin: '*',
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

    @SubscribeMessage(WsProtocol.SocketClientEventJoinGame)
    async joinGame(client: Socket, data: SocketClientMessageJoinGame) {
        Logger.log(`Got joinGame request. ${JSON.stringify(data)}`);
        WsGateway.ClientSockets.set(data.playerId, client);
        this.eventEmitter.emit(AppEvents.PlayerJoined, data);
    }

    @SubscribeMessage(WsProtocol.SocketClientEventMove)
    async move(@MessageBody() data: SocketClientMessageMove) {
        Logger.log(`Got move request. ${JSON.stringify(data)}`);
        this.eventEmitter.emit(AppEvents.PlayerMove, data);
    }

    @SubscribeMessage(WsProtocol.SocketClientEventShoot)
    async shoot(@MessageBody() data: SocketClientMessageShoot) {
        Logger.log(`Got shoot request. ${JSON.stringify(data)}`);
        this.eventEmitter.emit(AppEvents.PlayerShoot, data);
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
        const sockets = WsGateway.InstanceSockets.get(event.instanceId);
        if (sockets) {
            sockets.forEach(socket => {
                socket.emit(event.socketEvent, event.message);
            });
        }
    }

}