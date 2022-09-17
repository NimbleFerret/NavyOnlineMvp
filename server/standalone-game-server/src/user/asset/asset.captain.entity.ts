/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface PlayerCaptainEntity {
    id: string;
    miningRewardNVY: string;
    stakingRewardNVY: string;
    traits: string;
    level: string;
    rarity: string;
    bg: number;
    acc: number;
    head: number;
    haircutOrHat: number;
    clothes: number;
}

export type CaptainDocument = Captain & Document;

@Schema()
export class Captain {
    @Prop()
    tokenId: string;

    @Prop()
    owner: string;

    @Prop()
    level: number;

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