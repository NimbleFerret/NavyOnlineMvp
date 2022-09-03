/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RandomDocument = Random & Document;

@Schema()
export class Random {

    // -------------------------------------
    // Rarity
    // -------------------------------------

    @Prop({ default: 55 })
    commonChance: number;

    @Prop({ default: 35 })
    rareChance: number;

    @Prop({ default: 12 })
    epicChance: number;

    @Prop({ default: 2 })
    legendaryChance: number;

    // -------------------------------------
    // Ship size
    // -------------------------------------

    @Prop({ default: 55 })
    smallChance: number;

    @Prop({ default: 30 })
    middleChance: number;

    @Prop({ default: 15 })
    largeChance: number;

}

export const RandomSchema = SchemaFactory.createForClass(Random);