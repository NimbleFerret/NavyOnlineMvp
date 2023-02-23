/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Collection } from './schema.collection';

export type ProjectDocument = Project & Document;

export enum ProjectState {
    DISABLED = 1,
    ANNOUNCEMENT = 2,
    MINTING = 3,
    MINTING_AND_SALE = 4,
    SALE = 5
}

@Schema()
export class Project {

    @Prop()
    active: boolean;

    @Prop()
    name: string;

    @Prop({
        type: Number,
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