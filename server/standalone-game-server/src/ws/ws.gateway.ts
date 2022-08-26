/* eslint-disable prettier/prettier */
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { AppEvents, NotifyEachPlayerEventMsg, NotifyPlayerEventMsg, PlayerDisconnectedEvent } from "../app.events";
import { Logger, OnModuleInit } from "@nestjs/common";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class WsGateway implements OnModuleInit {

    @WebSocketServer()
    server: Server;

    public static readonly ClientSockets = new Map<string, Socket>();

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

    @SubscribeMessage(WsGateway.SocketClientMessageJoinGame)
    async joinGame(client: Socket, data: DtoJoinGame) {
        WsGateway.ClientSockets.set(data.ethAddress, client);
        this.eventEmitter.emit(AppEvents.PlayerJoined, data);
    }

    @SubscribeMessage(WsGateway.SocketClientMessageMove)
    async move(@MessageBody() data: DtoMove) {
        this.eventEmitter.emit(AppEvents.PlayerMove, data);
    }

    @SubscribeMessage(WsGateway.SocketClientMessageShoot)
    async shoot(@MessageBody() data: DtoShoot) {
        this.eventEmitter.emit(AppEvents.PlayerShoot, data);
    }

    // -------------------------------------
    // WebSocket clients notification
    // -------------------------------------

    @OnEvent(AppEvents.NotifyPlayer)
    async handleNotifyPlayerEvent(event: NotifyPlayerEventMsg) {
        const playerSocket = WsGateway.ClientSockets.get(event.playerId);
        if (playerSocket) {
            playerSocket.emit(event.socketEvent, event.message);
        } else {
            Logger.error(`Unable to notify player: ${event.playerId} event: ${event.socketEvent}`);
        }
    }

    @OnEvent(AppEvents.NotifyEachPlayer)
    async handleNotifyEachPlayerEvent(event: NotifyEachPlayerEventMsg) {
        this.server.sockets.emit(event.socketEvent, event.message);
    }

}