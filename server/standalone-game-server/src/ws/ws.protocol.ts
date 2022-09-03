/* eslint-disable prettier/prettier */

import { EntityShip } from "src/game/entity/entity.ship";
import { EntityCharacter } from "src/island/entity/entity.character";

export enum SectorContent {
    EMPTY = 1,
    BASE = 2,
    ISLAND = 3,
    BOSS = 4,
    PVE = 5,
    PVP = 6
}

// -------------------------------------
// WebSocket server messages
// -------------------------------------

export interface SocketServerMessageGameInit {
    tickRate: number;
    instanceId: string;
    worldStateSyncInterval: number;
    ships: EntityShip[];
    characters: EntityCharacter[];
}

export interface SocketServerMessageUpdateWorldState {
    tick: number;
    ships: EntityShip[];
    characters: EntityCharacter[];
}

export interface SocketServerMessageAddEntity {
    ship: EntityShip;
    character: EntityCharacter;
}

export interface SocketServerMessageRemoveEntity {
    entityId: string;
}

export interface SocketServerMessageEntityMove {
    entityId: string;
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
    characters: EntityCharacter[];
}

// -------------------------------------
// WebSocket client messages
// -------------------------------------

export interface SocketClientMessageJoinGame {
    playerId: string;
    instanceId: string;
    sectorType: SectorContent;
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
    public static readonly SocketServerEventAddEntity = 'SocketServerEventAddEntity';
    public static readonly SocketServerEventRemoveEntity = 'SocketServerEventRemoveEntity';
    public static readonly SocketServerEventUpdateWorldState = 'SocketServerEventUpdateWorldState';
    public static readonly SocketServerEventEntityMove = 'SocketServerEventEntityMove';
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