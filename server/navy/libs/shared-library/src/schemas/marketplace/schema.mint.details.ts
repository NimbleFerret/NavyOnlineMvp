/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ProjectDetails } from './schema.project';

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

export interface MintDetails {
    chainId: string;
    chainName: string;
    mintPriceEth: number;
}

@Schema()
export class MintDetails {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectDetails' })
    projectDetails: ProjectDetails;

    // ------------------------------

    @Prop()
    mintingEnabled: boolean;

    @Prop()
    mintingStartTime: string;

    @Prop()
    mintingEndTime: string;

    @Prop()
    mintDetails: MintDetails[];

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