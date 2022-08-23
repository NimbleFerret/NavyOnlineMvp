/* eslint-disable prettier/prettier */
export interface EntityShip {
    currentArmor: number;
    currentHull: number;
    baseArmor: number;
    baseHull: number;
    canMove: boolean;
    maxSpeed: number;
    minSpeed: number;
    speedStep: number;
    currentSpeed: number;
    dy: number;
    dx: number;
    y: number;
    x: number;
    rotation: number;
    direction: string;
    isCollides: boolean;
    isAlive: boolean;
    shapeWidth: number;
    shapeHeight: number;
    shapeWidthHalf: number;
    shapeHeightHalf: number;
    id: string;
    ownerId: string;
}