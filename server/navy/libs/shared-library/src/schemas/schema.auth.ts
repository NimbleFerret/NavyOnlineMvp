/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserAuthDocument = UserAuth & Document;

@Schema()
export class UserAuth {
    @Prop({ index: true })
    email: string;

    @Prop()
    password: string;

    @Prop({ index: true })
    ethAddress: string;

    @Prop({ default: '' })
    nickname: string;
}

export const UserAuthSchema = SchemaFactory.createForClass(UserAuth);       