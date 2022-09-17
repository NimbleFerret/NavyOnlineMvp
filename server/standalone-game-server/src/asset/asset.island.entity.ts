/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface PlayerIslandEntity {
    id: string;
    level: number;
    rarity: number;
    terrain: string;
    miningRewardNVY: number;
    shipAndCaptainFee: number;
    maxMiners: number;
    minersFee: number;
}

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
    level: number;

    // Mining 

    @Prop()
    mining: boolean;

    @Prop()
    miningStartedAt: number;

    @Prop()
    miningDurationSeconds: number;

    @Prop()
    miningRewardNVY: number;

    @Prop()
    shipAndCaptainFee: number;

    @Prop()
    minersFee: number;
}

export const IslandSchema = SchemaFactory.createForClass(Island);