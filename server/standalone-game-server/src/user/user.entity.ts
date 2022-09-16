/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Ship } from 'src/shipyard/shipyard.ship.entity';
import { Island } from 'src/world/island.entity';

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

    @Prop({ default: '' })
    nickname: string;

    @Prop({ default: false })
    paidSubscriptionActive: boolean;

    @Prop()
    paidSubscriptionEndDate: string;

    @Prop({ default: 0 })
    nvyBalance: number;

    @Prop({ default: 0 })
    aksBalance: number;

    @Prop({ default: UserWorldState.WORLD })
    worldState: number;

    dailyPlayersKilled: number;
    dailyBotsKilled: number;
    dailyBossesKilled: number;

    weeklyPlayersKilled: number;
    weeklyBotsKilled: number;
    weeklyBossesKilled: number;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ship' }] })
    shipsOwned: Ship[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Island' }] })
    islandsOwned: Island[];
}

export const UserSchema = SchemaFactory.createForClass(User);