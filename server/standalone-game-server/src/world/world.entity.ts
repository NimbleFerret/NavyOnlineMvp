/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Sector } from './sector.entity';
import mongoose, { Document } from 'mongoose';


export type WorldDocument = World & Document;

@Schema()
export class World {
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sector' }] })
    sectors: Sector[];
}

export const WorldSchema = SchemaFactory.createForClass(World);