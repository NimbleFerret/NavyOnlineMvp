/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CaptainSettingsDocument = CaptainSettings & Document;

@Schema()
export class CaptainSettings {

    @Prop()
    commonCaptainDefaultTraits: number;

    @Prop()
    rareCaptainDefaultTraits: number;

    @Prop()
    epicCaptainDefaultTraits: number;

    @Prop()
    legendaryCaptainDefaultTraits: number;

}

export const CaptainSettingsSchema = SchemaFactory.createForClass(CaptainSettings);