/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SectorDocument = Sector & Document;

export enum SectorContent {
    EMPTY = 1,
    BASE = 2,
    ISLAND = 3,
    BOSS = 4,
    PVE = 5,
    PVP = 6
}

@Schema()
export class Sector {
    @Prop()
    x: number;

    @Prop()
    y: number;

    @Prop()
    content: number;
}

export const SectorSchema = SchemaFactory.createForClass(Sector);