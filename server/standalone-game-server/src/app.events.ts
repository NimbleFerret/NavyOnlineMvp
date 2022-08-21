/* eslint-disable prettier/prettier */
export enum AppEvents {
    NotifyPlayerEvent = "NotifyPlayerEvent",
    NotifyEachPlayerEvent = "NotifyEachPlayerEvent"
}

export interface NotifyPlayerEvent {
    // TODO json or bytes here ?
    message: string;
}