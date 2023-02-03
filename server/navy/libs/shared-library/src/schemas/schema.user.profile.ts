/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserProfileDocument = UserProfile & Document;

@Schema()
export class UserProfile {
    @Prop({ index: true })
    email: string;

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