/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Island, IslandSchema } from '../asset/asset.island.entity';

export type SectorDocument = Sector & Document;

@Schema()
export class Sector {
    @Prop()
    x: number;

    @Prop()
    y: number;

    @Prop()
    content: number;

    @Prop({ type: IslandSchema })
    island: Island;
}

export const SectorSchema = SchemaFactory.createForClass(Sector);