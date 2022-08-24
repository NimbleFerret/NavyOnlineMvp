/* eslint-disable prettier/prettier */
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { AppEvents, NotifyPlayerEventMsg, PlayerDisconnectedEvent } from "../app.events";
import { DtoJoinGame } from "./dto/dto.joinGame";
import { Logger, OnModuleInit } from "@nestjs/common";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class WsGateway implements OnModuleInit {

    // Server events
    public static readonly SocketServerGameInit = 'SocketServerGameInit';
    public static readonly SocketServerMessageAddShip = 'SocketServerMessageAddShip';
    public static readonly SocketServerMessageAddShell = 'SocketServerMessageAddShell';
    public static readonly SocketServerMessageRemoveShip = 'SocketServerMessageRemoveShip';
    public static readonly SocketServerMessageUpdateWorldState = 'SocketServerMessageUpdateWorldState';

    // Client events
    public static readonly SocketClientMessageJoinGame = 'SocketClientMessageJoinGame';
    public static readonly SocketClientMessageMove = 'SocketClientMessageMove';
    public static readonly SocketClientMessageShoot = 'SocketClientMessageShoot';

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

    @SubscribeMessage(WsGateway.SocketClientMessageJoinGame)
    async joinGame(client: Socket, data: DtoJoinGame) {
        WsGateway.ClientSockets.set(data.ethAddress, client);
        this.eventEmitter.emit(AppEvents.PlayerJoined, data);
    }

    @SubscribeMessage(WsGateway.SocketClientMessageMove)
    async move(@MessageBody() data: number) {
        console.log();
    }

    @SubscribeMessage(WsGateway.SocketClientMessageShoot)
    async shoot(@MessageBody() data: any) {
        console.log();
    }

    // -------------------------------------
    // WebSocket clients notification events
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
    async handleNotifyEachPlayerEvent(event: object) {
        this.server.sockets.emit(WsGateway.SocketServerMessageUpdateWorldState, event);
    }

}