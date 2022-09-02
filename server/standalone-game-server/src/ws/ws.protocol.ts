/* eslint-disable prettier/prettier */

import { EntityShip } from "src/game/entity/entity.ship";

// -------------------------------------
// WebSocket server messages
// -------------------------------------

export interface SocketServerMessageGameInit {
    tickRate: number;
    instanceId: string;
    worldStateSyncInterval: number;
    ships: EntityShip[];
}

export interface SocketServerMessageUpdateWorldState {
    tick: number;
    ships: EntityShip[];
}

export interface SocketServerMessageAddShip {
    ship: EntityShip;
}

export interface SocketServerMessageRemoveShip {
    shipId: string;
}

export interface SocketServerMessageShipMove {
    shipId: string;
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

export interface SocketServerMessageShipShoot {
    playerId: string;
    left: boolean;
    shotParams: ShotParams[];
}

export interface SocketServerMessageSync {
    tick: number;
    ships: EntityShip[];
}

// -------------------------------------
// WebSocket client messages
// -------------------------------------

export interface SocketClientMessageJoinGame {
    playerId: string;
    instanceId: string;
}

export interface SocketClientMessageLeaveGame {
    playerId: string;
    instanceId: string;
}

export interface SocketClientMessageMove {
    playerId: string;
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

export interface SocketClientMessageShoot {
    playerId: string;
    left: boolean;
    shotParams: ShotParams[];
}

export interface ShotParams {
    speed: number;
    dir: number;
    rotation: number;
}

export interface SocketClientMessageSync {
    playerId: string;
}

export interface SocketClientMessageRespawn {
    playerId: string;
}

export class WsProtocol {
    // Server -> Client events
    public static readonly SocketServerEventPong = 'SocketServerEventPong';
    public static readonly SocketServerEventGameInit = 'SocketServerEventGameInit';
    public static readonly SocketServerEventAddShip = 'SocketServerEventAddShip';
    public static readonly SocketServerEventRemoveShip = 'SocketServerEventRemoveShip';
    public static readonly SocketServerEventUpdateWorldState = 'SocketServerEventUpdateWorldState';
    public static readonly SocketServerEventShipMove = 'SocketServerEventShipMove';
    public static readonly SocketServerEventShipShoot = 'SocketServerEventShipShoot';
    public static readonly SocketServerEventSync = 'SocketServerEventSync';

    // Client -> Server events
    public static readonly SocketClientEventPing = 'SocketClientEventPing';
    public static readonly SocketClientEventJoinGame = 'SocketClientEventJoinGame';
    public static readonly SocketClientEventLeaveGame = 'SocketClientEventLeaveGame';
    public static readonly SocketClientEventMove = 'SocketClientEventMove';
    public static readonly SocketClientEventShoot = 'SocketClientEventShoot';
    public static readonly SocketClientEventSync = 'SocketClientEventSync';
    public static readonly SocketClientEventRespawn = 'SocketClientEventRespawn';
}