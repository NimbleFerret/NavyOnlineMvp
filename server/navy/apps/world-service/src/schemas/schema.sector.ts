import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IslandSchema, Island } from './schema.island';

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