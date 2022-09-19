/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum IslandSize {
    SMALL = 1,
    MIDDLE = 2,
    LARGE = 3,
    EXTRA_LARGE = 4
}

export interface PlayerIslandEntity {
    id: string;
    owner: string;
    level: number;
    size: number;
    rarity: number;
    terrain: string;
    miningRewardNVY: number;
    shipAndCaptainFee: number;
    maxMiners: number;
    miners: number;
    minersFee: number;
    mining: boolean;
    x: number;
    y: number;
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

    @Prop()
    rarity: number;

    @Prop({ default: IslandSize.SMALL })
    size: number;

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

    @Prop()
    miners: number;

    @Prop()
    maxMiners: number;
}

export const IslandSchema = SchemaFactory.createForClass(Island);