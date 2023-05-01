/* eslint-disable prettier/prettier */
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CollectionItemDocument = CollectionItem & Document;

export enum MarketplaceState {
    LISTED,
    SOLD,
    NONE,
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
    price: number;

    @Prop()
    image: string;

    @Prop({ type: Object })
    visuals: object;

    @Prop({ type: Object })
    traits: object;

    @Prop()
    rarity: string;

    @Prop()
    lastUpdated: number;

    @Prop({ default: false })
    needUpdate: boolean;

    @Prop()
    contractAddress: string;

    @Prop()
    collectionName: string;

    @Prop()
    chainId: string;

    @Prop()
    chainName: string;

    @Prop()
    coinSymbol: string;

    @Prop({
        type: Number,
        required: true,
        enum: [
            MarketplaceState.LISTED,
            MarketplaceState.SOLD,
            MarketplaceState.NONE
        ]
    })
    marketplaceState: MarketplaceState;

}

export const CollectionItemSchema = SchemaFactory.createForClass(CollectionItem);