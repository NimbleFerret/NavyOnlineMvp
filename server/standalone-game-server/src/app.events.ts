/* eslint-disable prettier/prettier */
export enum AppEvents {
    PlayerJoined = 'PlayerJoined',
    PlayerDisconnected = 'PlayerDisconnected',
    PlayerMove = 'PlayerMove',
    PlayerShoot = 'PlayerShoot',

    NotifyPlayer = 'NotifyPlayer',
    NotifyEachPlayer = 'NotifyEachPlayer',
}

// ---------------------------------
// Client event msg
// ---------------------------------

export interface PlayerJoinedEvent {
    message: string;
}

export interface PlayerDisconnectedEvent {
    playerId: string;
}

// ---------------------------------
// Server event msg
// ---------------------------------

export interface NotifyPlayerEventMsg {
    playerId: string;
    socketEvent: string;
    message: object;
}

export interface NotifyEachPlayerEventMsg {
    socketEvent: string;
    message: object;
}