/* eslint-disable prettier/prettier */
export enum AppEvents {

    // ---------------------------------
    // Internal events
    // ---------------------------------
    PlayerKilledPlayer = 'PlayerKilledPlayer',
    PlayerKilledBot = 'PlayerKilledBot',
    PlayerKilledBoss = 'PlayerKilledBoss',

    MintIngameReward = 'MintIngameReward',

    // ---------------------------------
    // Socket events
    // ---------------------------------
    PlayerJoinedInstance = 'PlayerJoinedInstance',
    PlayerLeave = 'PlayerLeave',
    PlayerDisconnected = 'PlayerDisconnected',
    PlayerInput = 'PlayerInput',
    // PlayerMove = 'PlayerMove',
    // PlayerShoot = 'PlayerShoot',
    PlayerSync = 'PlayerSync',
    PlayerRespawn = 'PlayerRespawn',

    NotifyPlayer = 'NotifyPlayer',
    NotifyEachPlayer = 'NotifyEachPlayer',
    PlayerJoined = "PlayerJoined",
}

// ---------------------------------
// Internal event msg
// ---------------------------------

export interface MintIngameReward {
    playerId: string;
    nvy: number;
    aks: number;
}

export interface PlayerKilledShip {
    playerId: string;
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
    exceptPlayer?: string;
}