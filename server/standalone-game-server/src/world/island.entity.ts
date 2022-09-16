/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IslandDocument = Island & Document;

@Schema()
export class Island {
    @Prop()
    tokenId: string;

    @Prop()
    owner: string;

    @Prop({ default: false })
    isBase: boolean;

    @Prop()
    x: number;

    @Prop()
    y: number;

    @Prop()
    terrain: string;

    @Prop()
    mining: boolean;
}

export const IslandSchema = SchemaFactory.createForClass(Island);