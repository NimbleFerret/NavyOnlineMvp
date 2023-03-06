import { AssetType, Rarity, ShipSize } from "../shared-library.main";
import { BaseGameObject } from "./entity.base";

export enum Role {
    BOT = 1,
    BOSS = 2,
    PLAYER = 3,
}

export enum ShipHullSize {
    SMALL = 1,
    MEDIUM = 2,
    LARGE = 3,
}

export enum ShipWindows {
    ONE = 1,
    TWO = 2,
    NONE = 3,
}

export enum ShipCannons {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    ZERO = 5
}

export enum GameEntityDirection {
    EAST = 1,
    NORTH = 2,
    NORTH_EAST = 3,
    NORTH_WEST = 4,
    SOUTH = 5,
    SOUTH_EAST = 6,
    SOUTH_WEST = 7,
    WEST = 8
}
export interface ShipObjectEntity extends BaseGameObject {
    acceleration: number;
    minSpeed: number;
    maxSpeed: number;
    direction: GameEntityDirection;
    serverShipRef: String;
    free: Boolean;
    role: Role;
    shipHullSize: ShipHullSize;
    shipWindows: ShipWindows;
    shipCannons: ShipCannons;
    cannonsRange: number;
    cannonsDamage: number;
    cannonsAngleSpread: number;
    armor: number;
    hull: number;
    accDelay: number;
    turnDelay: number;
    fireDelay: number;
}

export class ShipEntity {

    public static GetFreeShipStats(id: string, ownerId: string) {
        const ship: ShipObjectEntity = {
            x: 100,
            y: 207,
            minSpeed: 0,
            maxSpeed: 300,
            acceleration: 50,
            direction: GameEntityDirection.EAST,
            id,
            ownerId,
            serverShipRef: "",
            free: true,
            role: Role.PLAYER,
            shipHullSize: ShipHullSize.SMALL,
            shipWindows: ShipWindows.NONE,
            shipCannons: ShipCannons.ONE,
            cannonsRange: 500,
            cannonsDamage: 1,
            cannonsAngleSpread: 40,
            armor: 300,
            hull: 300,
            accDelay: 0.500,
            turnDelay: 0.500,
            fireDelay: 0.500
        };
        return ship;
    }

}

// Basic structure
// export interface ShipEntity {
//     id: string;
//     owner: string;
//     type: AssetType;
//     armor: number;
//     hull: number;
//     maxSpeed: number;
//     accelerationStep: number;
//     accelerationDelay: number;
//     rotationDelay: number;
//     fireDelay: number;
//     cannons: number;
//     cannonsRange: number;
//     cannonsDamage: number;
//     level: number;
//     traits: number;
//     size: ShipSize;
//     rarity: Rarity;
//     windows: number;
//     anchor: number;
//     currentIntegrity: number;
//     maxIntegrity: number;
// }

// export interface GameObjectShipEntity extends ShipEntity, BaseGameObject {
//     // TODO replace by enum ?
//     direction: string;
//     role: string;
//     // TODO replace by enum ?
//     serverShipRef: string;
//     killerId: string;
//     currentSpeed: number;
//     currentArmor: number;
//     currentHull: number;
// }