/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserWorldState {
    WORLD = 1,
    SECTOR = 2,
}

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    ethAddress: string;

    @Prop()
    worldX: number;

    @Prop()
    worldY: number;

    @Prop()
    nickname: string;

    @Prop({ default: UserWorldState.WORLD })
    worldState: number;

    dailyPlayersKilled: number;
    dailyBotsKilled: number;
    dailyBossesKilled: number;

    weeklyPlayersKilled: number;
    weeklyBotsKilled: number;
    weeklyBossesKilled: number;
}

export const UserSchema = SchemaFactory.createForClass(User);