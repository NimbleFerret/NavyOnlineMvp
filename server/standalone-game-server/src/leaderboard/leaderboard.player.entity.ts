/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeaderboardPlayerDocument = LeaderboardPlayer & Document;

@Schema()
export class LeaderboardPlayer {
    @Prop({ required: true })
    playerEthAddress: string;

    @Prop()
    type: number;

    @Prop()
    goal: number;

    @Prop()
    score: number;
}

export const LeaderboardPlayerSchema = SchemaFactory.createForClass(LeaderboardPlayer);