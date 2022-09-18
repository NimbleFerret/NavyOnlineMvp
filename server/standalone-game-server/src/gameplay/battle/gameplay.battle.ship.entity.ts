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
    cannonsRange: number;
    cannonsDamage: number;
    armor: number;
    hull: number;
    maxSpeed: number;
    acc: number;
    accDelay: number;
    turnDelay: number;
    fireDelay: number;
}