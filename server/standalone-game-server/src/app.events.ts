/* eslint-disable prettier/prettier */
export enum AppEvents {
    PlayerJoinedEvent = 'PlayerJoinedEvent',

    NotifyPlayerEvent = 'NotifyPlayerEvent',
    NotifyEachPlayerEvent = 'NotifyEachPlayerEvent'
}

export interface PlayerJoinedEvent {
    // TODO json or bytes here ?
    message: string;
}

export interface NotifyPlayerEvent {
    // TODO json or bytes here ?
    message: string;
}