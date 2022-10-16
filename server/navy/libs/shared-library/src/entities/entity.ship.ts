export interface ShipEntity {
    id: string;
    owner: string;
    type: string;
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
    size: string;
    rarity: string;
    windows: number;
    anchor: number;
    currentIntegrity: number;
    maxIntegrity: number;
}