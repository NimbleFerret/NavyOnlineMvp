/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TransactionType {
    MINT_NVY_INGAME = 'MINT_NVY_INGAME',
    MINT_NVY_ISLAND = 'MINT_NVY_ISLAND',
    MINT_AKS = 'MINT_AKS',
    MINT_CAPTAIN = 'MINT_CAPTAIN',
    MINT_SHIP = 'MINT_SHIP',
    MINT_ISLAND = 'MINT_ISLAND',
    NFT_LISTED = 'NFT_LISTED',
    NFT_SOLD = 'NFT_SOLD'
}

export enum TransactionStatus {
    CREATED = 'CREATED',
    FAILED = 'FAILED',
    COMPLETED = 'COMPLETED',
}

export interface BlockchainTransactionDto {
    transactionType: TransactionType;
    transactionStatus: TransactionStatus;
    transactionDetails: Object;
}

export type BlockchainTransactionDocument = BlockchainTransaction & Document;

@Schema()
export class BlockchainTransaction {

    @Prop({
        type: String,
        required: true,
        enum: [
            TransactionType.MINT_NVY_INGAME,
            TransactionType.MINT_NVY_ISLAND,
            TransactionType.MINT_AKS,
            TransactionType.MINT_CAPTAIN,
            TransactionType.MINT_SHIP,
            TransactionType.MINT_ISLAND,
            TransactionType.NFT_LISTED,
            TransactionType.NFT_SOLD
        ]
    })
    transactionType: TransactionType;

    @Prop({
        type: String,
        required: true,
        enum: [
            TransactionStatus.CREATED,
            TransactionStatus.FAILED,
            TransactionStatus.COMPLETED
        ]
    })
    transactionStatus: TransactionStatus;

    @Prop({
        type: Object,
        required: true
    })
    transactionDetails: Object;

    @Prop({ type: Date, default: Date.now })
    date: Date

    @Prop()
    errorMessage: string;

}

export const BlockchainTransactionSchema = SchemaFactory.createForClass(BlockchainTransaction);