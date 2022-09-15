/* eslint-disable prettier/prettier */
import { BaseGameplayEntity } from "../gameplay.base.entity";

export interface GameplayShipEntity extends BaseGameplayEntity {
    currentArmor: number;
    currentHull: number;
    currentSpeed: number;
    direction: string;
    shipHullSize: number;
    shipWindows: number;
    shipGuns: number;
}