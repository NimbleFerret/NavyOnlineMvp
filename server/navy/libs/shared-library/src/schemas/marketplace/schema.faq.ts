/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FaqDocument = Faq & Document;

export interface QuestionAndAnswer {
    question: string;
    answer: string;
}

@Schema()
export class Faq {

    @Prop()
    questionsAndAnswers: QuestionAndAnswer[];
}

export const FaqSchema = SchemaFactory.createForClass(Faq);