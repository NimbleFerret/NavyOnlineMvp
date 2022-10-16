import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { SectorDocument } from './schema.sector';

export type WorldDocument = World & Document;

@Schema()
export class World {
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sector' }] })
    sectors: SectorDocument[];
}

export const WorldSchema = SchemaFactory.createForClass(World);