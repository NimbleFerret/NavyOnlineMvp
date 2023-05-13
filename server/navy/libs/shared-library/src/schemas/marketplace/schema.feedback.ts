/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema()
export class Feedback {

    @Prop()
    subject: string;

    @Prop()
    message: string;

    @Prop()
    from: string;

    @Prop({ type: Date, default: Date.now })
    date: Date
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);