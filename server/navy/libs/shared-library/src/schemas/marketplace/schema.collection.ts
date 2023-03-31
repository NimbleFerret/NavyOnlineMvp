/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Mint } from './schema.mint';

export type CollectionDocument = Collection & Document;

@Schema()
export class Collection {

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    contractAddress: string;

    @Prop()
    chainId: string;

    @Prop()
    collectionSize: number;

    @Prop()
    collectionItemsLeft: number;

    @Prop()
    preview: string[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Mint' })
    mint: Mint;

}

export const CollectionSchema = SchemaFactory.createForClass(Collection);