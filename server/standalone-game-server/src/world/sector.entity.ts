/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SectorDocument = Sector & Document;

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