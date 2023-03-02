/* eslint-disable prettier/prettier */
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CollectionItemDocument = CollectionItem & Document;

export enum MarketplaceState {
    NONDE,
    LISTED,
    SOLD
}

@Schema()
export class CollectionItem {

    @Prop({
        required: true,
        index: true
    })
    id: string;

    @Prop()
    tokenId: number;

    @Prop()
    tokenUri: string;

    @Prop()
    seller: string;

    @Prop()
    owner: string;

    @Prop()
    price: string;

    @Prop()
    image: string;

    @Prop()
    lastUpdated: number;

    @Prop({ default: false })
    needUpdate: boolean;

    @Prop()
    nftContract: string;

    @Prop()
    chainId: string;

    @Prop({
        type: Number,
        required: true,
        enum: [
            MarketplaceState.NONDE,
            MarketplaceState.LISTED,
            MarketplaceState.SOLD,
        ]
    })
    marketplaceState: MarketplaceState;

}

export const CollectionItemSchema = SchemaFactory.createForClass(CollectionItem);