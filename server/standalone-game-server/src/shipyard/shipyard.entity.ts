/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShipyardDocument = Shipyard & Document;

@Schema()
export class Shipyard {

    // -------------------------------------
    // Ship basic stats
    // -------------------------------------

    @Prop({ default: 100 })
    armorAndHullStep: number;

    @Prop({ default: 10 })
    speedAndAccStep: number;

    @Prop({ default: 10 })
    delayStep: number;

    @Prop({ default: 1 })
    cannonsStep: number;

    @Prop({ default: 50 })
    cannonsRangeStep: number;

    @Prop({ default: 5 })
    cannonsDamageStep: number;

    // Small ship

    @Prop({ default: 300 })
    smallShipMinHull: number;

    @Prop({ default: 1000 })
    smallShipMaxHull: number;

    @Prop({ default: 300 })
    smallShipMinArmor: number;

    @Prop({ default: 1000 })
    smallShipMaxArmor: number;

    @Prop({ default: 130 })
    smallShipMinSpeed: number;

    @Prop({ default: 250 })
    smallShipMaxSpeed: number;

    @Prop({ default: 20 })
    smallShipMinAcc: number;

    @Prop({ default: 80 })
    smallShipMaxAcc: number;

    @Prop({ default: 100 })
    smallShipMinAccDelay: number;

    @Prop({ default: 200 })
    smallShipMaxAccDelay: number;

    @Prop({ default: 100 })
    smallShipMinRotDelay: number;

    @Prop({ default: 250 })
    smallShipMaxRotDelay: number;

    @Prop({ default: 1 })
    smallShipMinCannons: number;

    @Prop({ default: 3 })
    smallShipMaxCannons: number;

    @Prop({ default: 600 })
    smallShipMinCannonsRange: number;

    @Prop({ default: 1000 })
    smallShipMaxCannonsRange: number;

    @Prop({ default: 20 })
    smallShipMinCannonsDamage: number;

    @Prop({ default: 50 })
    smallShipMaxCannonsDamage: number;

    // Middle ship

    @Prop({ default: 300 })
    middleShipMinHull: number;

    @Prop({ default: 1000 })
    middleShipMaxHull: number;

    @Prop({ default: 300 })
    middleShipMinArmor: number;

    @Prop({ default: 1000 })
    middleShipMaxArmor: number;

    @Prop({ default: 130 })
    middleShipMinSpeed: number;

    @Prop({ default: 250 })
    middleShipMaxSpeed: number;

    @Prop({ default: 20 })
    middleShipMinAcc: number;

    @Prop({ default: 80 })
    middleShipMaxAcc: number;

    @Prop({ default: 100 })
    middleShipMinAccDelay: number;

    @Prop({ default: 200 })
    middleShipMaxAccDelay: number;

    @Prop({ default: 100 })
    middleShipMinRotDelay: number;

    @Prop({ default: 250 })
    middleShipMaxRotDelay: number;

    @Prop({ default: 1 })
    middleShipMinCannons: number;

    @Prop({ default: 3 })
    middleShipMaxCannons: number;

    @Prop({ default: 600 })
    middleShipMinCannonsRange: number;

    @Prop({ default: 1000 })
    middleShipMaxCannonsRange: number;

    @Prop({ default: 20 })
    middleShipMinCannonsDamage: number;

    @Prop({ default: 50 })
    middleShipMaxCannonsDamage: number;

    // Large ship

    @Prop({ default: 300 })
    largeShipMinHull: number;

    @Prop({ default: 1000 })
    largeShipMaxHull: number;

    @Prop({ default: 300 })
    largeShipMinArmor: number;

    @Prop({ default: 1000 })
    largeShipMaxArmor: number;

    @Prop({ default: 130 })
    largeShipMinSpeed: number;

    @Prop({ default: 250 })
    largeShipMaxSpeed: number;

    @Prop({ default: 20 })
    largeShipMinAcc: number;

    @Prop({ default: 80 })
    largeShipMaxAcc: number;

    @Prop({ default: 100 })
    largeShipMinAccDelay: number;

    @Prop({ default: 200 })
    largeShipMaxAccDelay: number;

    @Prop({ default: 100 })
    largeShipMinRotDelay: number;

    @Prop({ default: 250 })
    largeShipMaxRotDelay: number;

    @Prop({ default: 1 })
    largeShipMinCannons: number;

    @Prop({ default: 3 })
    largeShipMaxCannons: number;

    @Prop({ default: 600 })
    largeShipMinCannonsRange: number;

    @Prop({ default: 1000 })
    largeShipMaxCannonsRange: number;

    @Prop({ default: 20 })
    largeShipMinCannonsDamage: number;

    @Prop({ default: 50 })
    largeShipMaxCannonsDamage: number;

    // -------------------------------------
    // Ship creation
    // -------------------------------------

    @Prop({ default: 1 })
    smallShipCreateNvyPrice: number;

    @Prop({ default: 10 })
    smallShipCreateAksPrice: number;

    @Prop({ default: 1 })
    middleShipCreateNvyPrice: number;

    @Prop({ default: 20 })
    middleShipCreateAksPrice: number;

    // -------------------------------------
    // Ship repair
    // -------------------------------------

    @Prop({ default: 10 })
    smallShipRepairAksPrice: number;

    @Prop({ default: 20 })
    middleShipRepairAksPrice: number;

    // -------------------------------------
    // Ship upgrades
    // -------------------------------------

    @Prop({ default: 2 })
    maxFreeLevel: number;

    // Chances

    @Prop({ default: 100 })
    level1Chance: number;

    @Prop({ default: 100 })
    level2Chance: number;

    @Prop({ default: 70 })
    level3Chance: number;

    @Prop({ default: 51 })
    level4Chance: number;

    @Prop({ default: 39 })
    level5Chance: number;

    @Prop({ default: 28 })
    level6Chance: number;

    @Prop({ default: 20 })
    level7Chance: number;

    @Prop({ default: 14 })
    level8Chance: number;

    @Prop({ default: 10 })
    level9Chance: number;

    @Prop({ default: 5 })
    level10Chance: number;

    // Nvy cost

    @Prop({ default: 1 })
    level1CostNvy: number;

    @Prop({ default: 1 })
    level2CostNvy: number;

    @Prop({ default: 1 })
    level3CostNvy: number;

    @Prop({ default: 1 })
    level4CostNvy: number;

    @Prop({ default: 1 })
    level5CostNvy: number;

    @Prop({ default: 1 })
    level6CostNvy: number;

    @Prop({ default: 1 })
    level7CostNvy: number;

    @Prop({ default: 1 })
    level8CostNvy: number;

    @Prop({ default: 1 })
    level9CostNvy: number;

    @Prop({ default: 1 })
    level10CostNvy: number;

    // Aks cost

    @Prop({ default: 55 })
    level1CostAks: number;

    @Prop({ default: 55 })
    level2CostAks: number;

    @Prop({ default: 55 })
    level3CostAks: number;

    @Prop({ default: 55 })
    level4CostAks: number;

    @Prop({ default: 55 })
    level5CostAks: number;

    @Prop({ default: 55 })
    level6CostAks: number;

    @Prop({ default: 55 })
    level7CostAks: number;

    @Prop({ default: 55 })
    level8CostAks: number;

    @Prop({ default: 55 })
    level9CostAks: number;

    @Prop({ default: 55 })
    level10CostAks: number;

}

export const ShipyardSchema = SchemaFactory.createForClass(Shipyard);