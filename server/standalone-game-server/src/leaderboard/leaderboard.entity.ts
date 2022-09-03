/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum LeaderboardType {
    DAILY = 1,
    WEEKLY = 2,
}

export enum LeaderboardGoal {
    PlayerKill = 1,
    BotKill = 2,
    BossKill = 3,
}

export type LeaderboardDocument = Leaderboard & Document;

@Schema()
export class Leaderboard {
    @Prop()
    type: number;

    @Prop()
    goal: number;

    @Prop()
    top1RewardNvy: number;

    @Prop()
    top1RewardAks: number;

    @Prop()
    top3RewardNvy: number;

    @Prop()
    top3RewardAks: number;

    @Prop()
    top8RewardNvy: number;

    @Prop()
    top8RewardAks: number;

    @Prop()
    top15RewardNvy: number;

    @Prop()
    top15RewardAks: number;

    @Prop()
    top21RewardNvy: number;

    @Prop()
    top21RewardAks: number;

    @Prop()
    restRewardNvy: number;

    @Prop()
    restRewardAks: number;
}

export const LeaderboardSchema = SchemaFactory.createForClass(Leaderboard);