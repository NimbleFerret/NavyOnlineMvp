/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserWorldState } from '../shared-library.main';

export type UserAvatarDocument = UserAvatar & Document;

@Schema()
export class UserAvatar {

    @Prop()
    worldX: number;

    @Prop()
    worldY: number;

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

export const UserAvatarSchema = SchemaFactory.createForClass(UserAvatar);