/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDetailsDocument = ProjectDetails & Document;

export enum ProjectState {
    DISABLED = 1,
    ANNOUNCEMENT = 2,
    MINTING = 3,
    MINTING_AND_SALE = 4,
    SALE = 5
}

@Schema()
export class ProjectDetails {

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

}

export const ProjectDetailsSchema = SchemaFactory.createForClass(ProjectDetails);