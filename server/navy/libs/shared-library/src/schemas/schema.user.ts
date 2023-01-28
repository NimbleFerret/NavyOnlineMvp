/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserWorldState } from '../shared-library.main';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true, index: true })
    ethAddress: string;

    @Prop()
    worldX: number;

    @Prop()
    worldY: number;

    @Prop({ default: '' })
    nickname: string;

    @Prop({ default: false })
    paidSubscriptionActive: boolean;

    @Prop()
    paidSubscriptionEndDate: string;

    @Prop({
        type: String,
        required: true,
        enum: [
            UserWorldState.SECTOR,
            UserWorldState.WORLD
        ],
        default: UserWorldState.WORLD
    })
    worldState: UserWorldState;

    @Prop({ default: 0 })
    dailyPlayersKilled: number;

    @Prop({ default: 0 })
    dailyBotsKilled: number;

    @Prop({ default: 0 })
    dailyBossesKilled: number;
}

export const UserSchema = SchemaFactory.createForClass(User);