/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Rarity, ShipSize } from '../shared-library.main';
import { UserAvatarDocument } from './schema.user.avatar';

export type ShipDocument = Ship & Document;

@Schema()
export class Ship {

    @Prop({ required: true })
    tokenId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    owner: UserAvatarDocument;

    @Prop()
    hull: number;

    @Prop()
    armor: number;

    @Prop()
    maxSpeed: number;

    @Prop()
    accelerationStep: number;

    @Prop()
    accelerationDelay: number;

    @Prop()
    rotationDelay: number;

    @Prop()
    fireDelay: number;

    @Prop()
    cannons: number;

    @Prop()
    cannonsRange: number;

    @Prop()
    cannonsDamage: number;

    @Prop({
        type: Number,
        required: true,
        enum: [
            Rarity.COMMON,
            Rarity.RARE,
            Rarity.EPIC,
            Rarity.LEGENDARY,
        ]
    })
    rarity: Rarity;

    @Prop({
        type: Number,
        required: true,
        enum: [
            ShipSize.SMALL,
            ShipSize.MIDDLE,
            ShipSize.LARGE
        ]
    })
    size: ShipSize;

    @Prop()
    traits: number;

    @Prop()
    level: number;

    @Prop()
    windows: number;

    @Prop()
    anchor: number;

    @Prop()
    currentIntegrity: number;

    @Prop()
    maxIntegrity: number;
}

export const ShipSchema = SchemaFactory.createForClass(Ship);