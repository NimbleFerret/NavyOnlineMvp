export interface BaseGameObject {
    x: number;
    y: number;
    id: string;
    ownerId: string;
    acceleration: number;
    minSpeed: number;
    maxSpeed: number;
    currentSpeed: number;
    movementDelay: number;
}