/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ShipType {
    FREE = 1,
    COMMON = 2
}

export enum ShipSize {
    SMALL = 1,
    MIDDLE = 2,
    LARGE = 3
}

export type ShipDocument = Ship & Document;

@Schema()
export class Ship {

    @Prop({ required: true })
    tokenId: string;

    @Prop()
    hull: number;

    @Prop()
    armor: number;

    @Prop()
    speed: number;

    @Prop()
    acc: number;

    @Prop()
    accDelay: number;

    @Prop()
    rotDelay: number;

    @Prop()
    cannons: number;

    @Prop()
    cannonsRange: number;

    @Prop()
    cannonsDamage: number;

    @Prop()
    rarity: number;

    @Prop()
    size: number;

    @Prop()
    type: number;

}

export const ShipSchema = SchemaFactory.createForClass(Ship);