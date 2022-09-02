/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IslandDocument = Island & Document;

@Schema()
export class Island {
    @Prop({ required: true })
    tokenId: string;

    @Prop({ required: true })
    owner: string;

    @Prop()
    x: number;

    @Prop()
    y: number;
}

export const IslandSchema = SchemaFactory.createForClass(Island);