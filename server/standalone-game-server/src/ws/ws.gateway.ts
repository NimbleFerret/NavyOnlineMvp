/* eslint-disable prettier/prettier */
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { AppEvents, NotifyPlayerEvent, NotifyWorldStateEvent } from "../app.events";
import { DtoJoinGame } from "./dto/dto.joinGame";
import { OnModuleInit } from "@nestjs/common";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class WsGateway implements OnModuleInit {

    // Server events
    private static readonly SocketServerMessageAddShip = 'SocketServerMessageAddShip';
    private static readonly SocketServerMessageAddShell = 'SocketServerMessageAddShell';
    private static readonly SocketServerMessageRemoveShip = 'SocketServerMessageRemoveShip';
    private static readonly SocketServerMessageUpdateWorldState = 'SocketServerMessageUpdateWorldState';

    // Client events
    private static readonly SocketClientMessageJoinGame = 'SocketClientMessageJoinGame';
    private static readonly SocketClientMessageMove = 'SocketClientMessageMove';
    private static readonly SocketClientMessageShoot = 'SocketClientMessageShoot';

    @WebSocketServer()
    server: Server;

    // TODO clientId > socket map

    constructor(private eventEmitter: EventEmitter2) {
        // TODO handle ws disconnected event
        // TODO iterate sockets
    }

    onModuleInit() {
        this.server.on("connection", (socket) => {
            console.log('Got connection!');
        });

        this.server.on('disconnect', function (socket) {
            console.log('Got disconnect!');
        });
    }

    @SubscribeMessage(WsGateway.SocketClientMessageJoinGame)
    async joinGame(@MessageBody() data: DtoJoinGame) {
        this.eventEmitter.emit(AppEvents.PlayerJoinedEvent, data);
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

    @OnEvent(AppEvents.NotifyPlayerEvent, { async: true })
    async handleNotifyPlayerEvent(event: NotifyPlayerEvent) {
        // this.server.of()
    }

    @OnEvent(AppEvents.NotifyEachPlayerEvent)
    async handleNotifyEachPlayerEvent(event: NotifyWorldStateEvent) {
        console.log('handleNotifyEachPlayerEvent');
        console.log(event);

        this.server.sockets.emit(WsGateway.SocketServerMessageUpdateWorldState, event);
    }


}