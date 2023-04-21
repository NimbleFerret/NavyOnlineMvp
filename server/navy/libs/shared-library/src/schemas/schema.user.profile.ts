/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserProfileDocument = UserProfile & Document;

export enum EmailState {
    WAITING_FOR_CONFIRMATION = 0,
    CONFIRMED = 1
}

@Schema()
export class UserProfile {
    @Prop({ index: true })
    email: string;

    @Prop({
        type: Number,
        required: true,
        enum: [
            EmailState.WAITING_FOR_CONFIRMATION,
            EmailState.CONFIRMED
        ]
    })
    emailState: EmailState;

    @Prop()
    authToken: string;

    // TODO hash it
    @Prop()
    password: string;

    @Prop({ index: true })
    ethAddress: string;

    @Prop({ index: true })
    nickname: string;

    @Prop({ default: false })
    paidSubscriptionActive: boolean;

    @Prop()
    paidSubscriptionEndDate: string;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);       