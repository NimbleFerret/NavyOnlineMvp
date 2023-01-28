import { AssetType, Rarity, ShipSize } from "../shared-library.main";
import { BaseGameObject } from "./entity.base";

// Basic structure
export interface ShipEntity {
    id: string;
    owner: string;
    type: AssetType;
    armor: number;
    hull: number;
    maxSpeed: number;
    accelerationStep: number;
    accelerationDelay: number;
    rotationDelay: number;
    fireDelay: number;
    cannons: number;
    cannonsRange: number;
    cannonsDamage: number;
    level: number;
    traits: number;
    size: ShipSize;
    rarity: Rarity;
    windows: number;
    anchor: number;
    currentIntegrity: number;
    maxIntegrity: number;
}

export interface GameObjectShipEntity extends ShipEntity, BaseGameObject {
    // TODO replace by enum ?
    direction: string;
    role: string;
    // TODO replace by enum ?
    serverShipRef: string;
    killerId: string;
    currentSpeed: number;
    currentArmor: number;
    currentHull: number;
}