/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Rarity } from '../shared-library.main';
import { UserAvatarDocument } from './schema.user.avatar';

export type MintDetailsDocument = MintDetails & Document;

export interface RarityDetails {
    titleText: string;
    titleColor: string;
    description: string;
}

export interface NftPartsDetails {
    categoryTitle: string;
    categoryDetails: NftCategoryDetails[];
}

export interface NftCategoryDetails {
    imageUrl: string;
    chancePercent: number;
    rarity: string;
}

@Schema()
export class MintDetails {

    @Prop()
    active: boolean;

    // ------------------------------

    @Prop()
    mintingEnabled: boolean;

    @Prop()
    mintingStartTime: string;

    @Prop()
    mintingPriceCronos: number;

    @Prop()
    mintingPriceUSD: number;

    // ------------------------------

    @Prop()
    collectionSize: number;

    @Prop()
    collectionItemsLeft: number;

    @Prop()
    collectionPreview: string[];

    // ------------------------------

    @Prop()
    descriptionTitle: string;

    @Prop()
    descriptionDescription: string;

    // ------------------------------

    @Prop()
    profitability: boolean;

    @Prop()
    profitabilityTitle: string;

    @Prop()
    profitabilityValue: string;

    @Prop()
    profitabilityDescription: string;

    // ------------------------------

    @Prop()
    rarity: boolean;

    @Prop()
    rarityTitle: string;

    @Prop()
    rarityDescription: string;

    @Prop()
    rarityItems: RarityDetails[];

    // ------------------------------

    @Prop()
    nftParts: boolean;

    @Prop()
    nftPartsTitle: string;

    @Prop()
    nftPartsDescription: string;

    @Prop()
    nftPartsItems: NftPartsDetails[];

    // ------------------------------

}

export const MintDetailsSchema = SchemaFactory.createForClass(MintDetails);