/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MintDocument = Mint & Document;

export interface RarityItem {
    titleText: string;
    titleColor: string;
    description: string;
}

export interface NftPartItem {
    categoryTitle: string;
    categoryDetails: NftCategoryDetails[];
}

export interface NftCategoryDetails {
    imageUrl: string;
    chancePercent: number;
    rarity: string;
}

export interface MintDetails {
    chainId: string;
    chainName: string;
    mintPriceEth: number;
    saleContractAddress: string;
    tokenContractAddress: string;
}

@Schema()
export class Mint {

    // ------------------------------

    @Prop()
    mintingEnabled: boolean;

    @Prop()
    mintingStartTime: string;

    @Prop()
    mintingEndTime: string;

    @Prop()
    mintingDetails: MintDetails[];

    // ------------------------------

    @Prop()
    collectionSize: number;

    @Prop()
    collectionTokensMinted: number;

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
    rarityItems: RarityItem[];

    // ------------------------------

    @Prop()
    nftParts: boolean;

    @Prop()
    nftPartsTitle: string;

    @Prop()
    nftPartsDescription: string;

    @Prop()
    nftPartsItems: NftPartItem[];

}

export const MintSchema = SchemaFactory.createForClass(Mint);