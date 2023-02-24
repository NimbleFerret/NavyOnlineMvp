/* eslint-disable prettier/prettier */
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CollectionItemDocument = CollectionItem & Document;

@Schema()
export class CollectionItem {

    @Prop()
    tokenAddress: string;

    @Prop()
    tokenId: string;

    @Prop()
    amount: number;

    @Prop()
    tokenHash: string;

    @Prop()
    blockNumberMinted: string;

    @Prop()
    updatedAt: string;

    @Prop()
    contractType: string;

    @Prop()
    name: string;

    @Prop()
    symbol: string;

    @Prop()
    tokenUri: string;

    @Prop()
    metadata: Map<string, Object>;

    @Prop()
    minterAddress: string;

    @Prop()
    chain: string;

}

export const CollectionItemSchema = SchemaFactory.createForClass(CollectionItem);