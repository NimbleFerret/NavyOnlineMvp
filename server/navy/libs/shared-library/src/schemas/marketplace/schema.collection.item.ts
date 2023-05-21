/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CollectionItemDocument = CollectionItem & Document;

export enum MarketplaceState {
    LISTED = 'Listed',
    SOLD = 'Sold',
    NONE = 'None',
}

@Schema()
export class CollectionItem {

    @Prop({
        required: true,
        index: true
    })
    id: string;

    @Prop({ required: true })
    tokenId: number;

    @Prop({ required: true })
    tokenUri: string;

    @Prop()
    seller: string;

    @Prop({ required: true })
    owner: string;

    @Prop({ required: true, default: 0 })
    price: number;

    @Prop({ required: true })
    image: string;

    @Prop({ required: true, type: Object })
    visuals: object;

    @Prop({ required: true, type: Object })
    traits: object;

    @Prop({ required: true })
    rarity: string;

    @Prop({ required: true })
    lastUpdated: number;

    @Prop({ required: true, default: false })
    needUpdate: boolean;

    @Prop({ required: true })
    contractAddress: string;

    @Prop({ required: true })
    collectionName: string;

    @Prop({ required: true })
    chainId: string;

    @Prop({ required: true })
    chainName: string;

    @Prop({ required: true })
    tokenSymbol: string;

    @Prop({
        type: String,
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