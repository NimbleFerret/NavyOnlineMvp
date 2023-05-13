/* eslint-disable prettier/prettier */
import { Rarity } from '@app/shared-library/shared-library.main';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserAvatarDocument } from '../schema.user.avatar';

export type CaptainDocument = Captain & Document;

@Schema()
export class Captain {

    // Common
    @Prop()
    tokenId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    owner: UserAvatarDocument;

    @Prop({
        type: Number,
        required: true,
        enum: [
            Rarity.COMMON,
            Rarity.RARE,
            Rarity.EPIC,
            Rarity.LEGENDARY,
        ]
    })
    rarity: Rarity;

    @Prop()
    level: number;

    @Prop()
    traits: number;

    // NFT parts
    @Prop()
    bg: number;

    @Prop()
    acc: number;

    @Prop()
    face: number;

    @Prop()
    head: number;

    @Prop()
    clothes: number;

}

export const CaptainSchema = SchemaFactory.createForClass(Captain);