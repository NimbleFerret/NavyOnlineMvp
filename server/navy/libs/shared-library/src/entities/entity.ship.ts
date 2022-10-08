export interface ShipEntity {
    id: string;
    owner: string;
    type: number;
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
    size: number;
    rarity: number;
    windows: number;
    anchor: number;
    currentIntegrity: number;
    maxIntegrity: number;
}