/* eslint-disable prettier/prettier */

export enum DailyTaskType {
    KILL_PLAYERS = 1,
    KILL_BOTS = 2,
    KILL_BOSSES = 3,
}

// -------------------------------------
// WebSocket server messages
// -------------------------------------

export interface SocketServerDailyTaskChange {
    dailyPlayersKilledCurrent: number;
    dailyPlayersKilledMax: number;
    dailyBotsKilledCurrent: number;
    dailyBotsKilledMax: number;
    dailyBossesKilledCurrent: number
    dailyBossesKilledMax: number;
}

export interface SocketServerDailyTaskComplete {
    dailyTaskType: DailyTaskType;
    rewardNVY: number;
    rewardAKS: number;
}

// -------------------------------------
// Gameplay
// -------------------------------------

export interface BaseServerGameplayMessage {
    tick: number;
}
export interface SocketServerMessageGameInit extends BaseServerGameplayMessage {
    tickRate: number;
    instanceId: string;
    worldStateSyncInterval: number;
    entities: object[];
}

export interface SocketServerMessageUpdateWorldState extends BaseServerGameplayMessage {
    tick: number;
    entities: object[];
    forced?: boolean;
}

export interface SocketServerMessageAddEntity {
    entity: object;
}

export interface SocketServerMessageRemoveEntity {
    entityId: string;
}

export interface SocketServerMessageEntityInputs extends BaseServerGameplayMessage {
    inputs: SocketServerMessageEntityInput[];
}

export interface SocketServerMessageEntityInput {
    playerId: string;
    inputType: PlayerInputType;
    shootDetails?: ShootInputDetails;
}

export interface SocketServerMessageSync {
    tick: number;
    entities: object[];
}

// -------------------------------------
// WebSocket client messages
// -------------------------------------

export interface SocketClientMessageJoinGame {
    playerId: string;
    entityId: string;
    instanceId: string;
}

export interface SocketClientMessageLeaveGame {
    playerId: string;
    instanceId: string;
}

export enum PlayerInputType {
    MOVE_UP = 1,
    MOVE_DOWN = 2,
    MOVE_LEFT = 3,
    MOVE_RIGHT = 4,
    SHOOT = 5
}

export enum Side {
    LEFT = 1,
    RIGHT = 2
}

export interface SocketClientMessageInput {
    playerId: string;
    playerInputType: PlayerInputType;
    index: number;
    shootDetails?: ShootInputDetails;
}

export interface ShootInputDetails {
    side: Side,
    aimAngleRads: number
}

export interface SocketClientMessageSync {
    playerId: string;
}

export interface SocketClientMessageRespawn {
    playerId: string;
    entityId: string;
}

export class WsProtocol {
    // Server -> Client events
    public static readonly SocketServerEventPong = 'SocketServerEventPong';
    public static readonly SocketServerEventGameInit = 'SocketServerEventGameInit';
    public static readonly SocketServerEventAddEntity = 'SocketServerEventAddEntity';
    public static readonly SocketServerEventRemoveEntity = 'SocketServerEventRemoveEntity';
    public static readonly SocketServerEventUpdateWorldState = 'SocketServerEventUpdateWorldState';
    public static readonly SocketServerEventEntityInput = 'SocketServerEventEntityInput';
    public static readonly SocketServerEventEntityInputs = 'SocketServerEventEntityInputs';
    public static readonly SocketServerEventSync = 'SocketServerEventSync';

    public static readonly SocketServerEventDailyTaskUpdate = 'SocketServerEventDailyTaskUpdate';
    public static readonly SocketServerEventDailyTaskReward = 'SocketServerEventDailyTaskReward';

    // Client -> Server events
    public static readonly SocketClientEventPing = 'SocketClientEventPing';
    public static readonly SocketClientEventJoinGame = 'SocketClientEventJoinGame';
    public static readonly SocketClientEventLeaveGame = 'SocketClientEventLeaveGame';
    public static readonly SocketClientEventInput = 'SocketClientEventInput';
    public static readonly SocketClientEventSync = 'SocketClientEventSync';
    public static readonly SocketClientEventRespawn = 'SocketClientEventRespawn';
}