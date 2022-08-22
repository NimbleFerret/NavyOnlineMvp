/* eslint-disable prettier/prettier */
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { AppEvents, NotifyPlayerEvent } from "../app.events";
import { DtoJoinGame } from "./dto/dto.joinGame";
import { OnModuleInit } from "@nestjs/common";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class WsGateway implements OnModuleInit {

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

    @SubscribeMessage('joinGame')
    async joinGame(@MessageBody() data: DtoJoinGame): Promise<number> {
        console.log('WS. joinGame: ' + data.ethAddress);

        this.eventEmitter.emit(AppEvents.PlayerJoinedEvent, data);

        return 1;
    }

    @SubscribeMessage('shoot')
    async shoot(@MessageBody() data: any): Promise<number> {
        return 1;
    }

    @SubscribeMessage('move')
    async move(@MessageBody() data: number): Promise<number> {
        return data;
    }

    // -------------------------------------
    // WebSocket clients notification events
    // -------------------------------------

    @OnEvent(AppEvents.NotifyPlayerEvent, { async: true })
    async handleNotifyPlayerEvent(event: NotifyPlayerEvent) {
        // this.server.of()
    }

    @OnEvent(AppEvents.NotifyEachPlayerEvent, { async: true })
    async handleNotifyEachPlayerEvent(event: NotifyPlayerEvent) {
        this.server.sockets.emit('worldUpdate', event);
    }

}