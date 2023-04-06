/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BidDocument = Bid & Document;

@Schema()
export class Bid {

    @Prop()
    contractAddress: string;

    @Prop()
    tokenId: string;

    @Prop()
    price: number;

    @Prop()
    bidInitiatorAddress: string;

    @Prop({ type: Date, default: Date.now })
    date: Date
}

export const BidSchema = SchemaFactory.createForClass(Bid);