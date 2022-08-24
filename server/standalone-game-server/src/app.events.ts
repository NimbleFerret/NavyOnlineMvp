import { EntityShip } from './game/entity/entity.ship';

/* eslint-disable prettier/prettier */
export enum AppEvents {
    PlayerJoined = 'PlayerJoined',
    PlayerDisconnected = 'PlayerDisconnected',

    NotifyPlayer = 'NotifyPlayer',
    NotifyEachPlayer = 'NotifyEachPlayer',
    NotifyAddShip = 'NotifyAddShip',
    NotifyRemoveShip = 'NotifyRemoveShip'
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

export interface NotifyWorldStateEventMsg {
    ships: EntityShip[];
}

export interface NotifyAddShipEventMsg {
    ship: EntityShip;
}

export interface NotifyRemoveShipEventMsg {
    shipId: string;
}