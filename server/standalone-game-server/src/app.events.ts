import { EntityShip } from './game/entity/entity.ship';
import { ShotParams } from './ws/dto/dto.shoot';

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

export interface NotifyWorldStateEventMsg {
    ships: EntityShip[];
}

export interface NotifyAddShipEventMsg {
    ship: EntityShip;
}

export interface NotifyRemoveShipEventMsg {
    shipId: string;
}

export interface NotifyShipMoveEventMsg {
    shipId: string;
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

export interface NotifyShipShootEventMsg {
    playerId: string;
    left: boolean;
    shotParams: ShotParams[];
}