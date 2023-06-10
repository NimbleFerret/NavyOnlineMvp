/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Collection } from './schema.collection';

export type ProjectDocument = Project & Document;

export enum ProjectState {
    DISABLED = 'Disabled',
    ANNOUNCEMENT = 'Annoucement',
    MINTING = 'Minting',
    MINTING_AND_SALE = 'Minting_and_sale',
    SALE = 'Sale'
}

@Schema()
export class Project {

    @Prop()
    active: boolean;

    @Prop()
    name: string;

    @Prop({
        type: String,
        required: true,
        enum: [
            ProjectState.DISABLED,
            ProjectState.ANNOUNCEMENT,
            ProjectState.MINTING,
            ProjectState.MINTING_AND_SALE,
            ProjectState.SALE,
        ]
    })
    state: ProjectState;

    @Prop()
    supportedChains: string[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }] })
    collections: Collection[];

}

export const ProjectSchema = SchemaFactory.createForClass(Project);