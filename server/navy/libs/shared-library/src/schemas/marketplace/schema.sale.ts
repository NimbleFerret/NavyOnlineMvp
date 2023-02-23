/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Collection } from './schema.collection';

export enum SaleType {
    INSTANT_INFINITE = 0,
    INSTANT_TIMED = 1,
    AUCTION_INFINITE = 2,
    AUCTION_TIMED = 3
}

export type SaleDocument = Sale & Document;

@Schema()
export class Sale {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' })
    collection: Collection;

    @Prop()
    chainId: string;

    @Prop()
    saleToken: string;

    @Prop()
    price: string;

    @Prop()
    redeemPrice: string;

    @Prop()
    seller: string;

    @Prop()
    tokenId: string;

    @Prop()
    saleType: string;

    @Prop()
    saleDurationHours: number;

}

export const SaleSchema = SchemaFactory.createForClass(Sale);