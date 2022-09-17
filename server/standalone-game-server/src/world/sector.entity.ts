/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Island } from 'src/user/asset/asset.island.entity';

export type SectorDocument = Sector & Document;

@Schema()
export class Sector {
    @Prop()
    x: number;

    @Prop()
    y: number;

    @Prop()
    content: number;

    @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Island' } })
    island: Island;
}

export const SectorSchema = SchemaFactory.createForClass(Sector);