/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CaptainTraitDocument = CaptainTrait & Document;

export enum TraitBonusType {
    PERCENT = 'Percent',
    FLAT = 'Flat'
}

@Schema()
export class CaptainTrait {

    @Prop()
    index: number;

    @Prop()
    description: string;

    @Prop({
        type: String,
        required: true,
        enum: [
            TraitBonusType.PERCENT,
            TraitBonusType.FLAT
        ]
    })
    bonusType: TraitBonusType;

    @Prop()
    shipStatsAffected: string[];

}

export const CaptainTraitSchema = SchemaFactory.createForClass(CaptainTrait);