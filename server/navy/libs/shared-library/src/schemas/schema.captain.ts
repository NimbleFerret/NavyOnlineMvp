/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CaptainDocument = Captain & Document;

@Schema()
export class Captain {

    // Common
    @Prop()
    tokenId: string;

    @Prop()
    owner: string;

    @Prop()
    rarity: number;

    @Prop()
    level: number;

    @Prop()
    traits: number;

    // NFT stuff
    @Prop()
    bg: number;

    @Prop()
    acc: number;

    @Prop()
    head: number;

    @Prop()
    haircutOrHat: number;

    @Prop()
    clothes: number;

    // Mining and staking
    @Prop()
    staking: boolean;

    @Prop()
    mining: boolean;

    @Prop()
    miningRewardNVY: number;

    @Prop()
    stakingRewardNVY: number;

    @Prop()
    miningStartedAt: number;

    @Prop()
    miningDurationSeconds: number;

    @Prop()
    miningIsland: number;
}

export const CaptainSchema = SchemaFactory.createForClass(Captain);