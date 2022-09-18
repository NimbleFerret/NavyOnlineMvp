/* eslint-disable prettier/prettier */
import { BaseGameplayEntity } from "../gameplay.base.entity";

export interface GameplayShipEntity extends BaseGameplayEntity {
    role: string;
    currentArmor: number;
    currentHull: number;
    currentSpeed: number;
    direction: string;
    shipHullSize: number;
    shipWindows: number;
    shipGuns: number;
    killerId: string;
}