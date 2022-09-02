/* eslint-disable prettier/prettier */
export enum AppEvents {

    // ---------------------------------
    // Socket events
    // ---------------------------------

    PlayerJoinedGameInstance = 'PlayerJoinedGameInstance',
    PlayerJoinedIslandInstance = 'PlayerJoinedIslandInstance',
    PlayerLeave = 'PlayerLeave',
    PlayerDisconnected = 'PlayerDisconnected',
    PlayerMove = 'PlayerMove',
    PlayerShoot = 'PlayerShoot',
    PlayerSync = 'PlayerSync',
    PlayerRespawn = 'PlayerRespawn',

    NotifyPlayer = 'NotifyPlayer',
    NotifyEachPlayer = 'NotifyEachPlayer',
}

// ---------------------------------
// Client event msg
// ---------------------------------

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
    instanceId: string;
    socketEvent: string;
    message: object;
}