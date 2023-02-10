/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConfirmationCodeDocument = ConfirmationCode & Document;

@Schema()
export class ConfirmationCode {

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    code: string;

    @Prop({ default: 4 })
    attemptsLeft: number;

    @Prop()
    expirationDate: Date;

}

export const ConfirmationCodeSchema = SchemaFactory.createForClass(ConfirmationCode);