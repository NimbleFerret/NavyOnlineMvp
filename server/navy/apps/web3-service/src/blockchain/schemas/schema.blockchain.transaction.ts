/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TransactionType {
    MINT_NVY_INGAME = 'MINT_NVY_INGAME',
    MINT_NVY_ISLAND = 'MINT_NVY_ISLAND',
    MINT_AKS = 'MINT_AKS',
    MINT_FOUNDERS_CAPTAIN = 'MINT_FOUNDERS_CAPTAIN',
    MINT_FOUNDERS_SHIP = 'MINT_FOUNDERS_SHIP',
    MINT_FOUNDERS_ISLAND = 'MINT_FOUNDERS_ISLAND'
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
            TransactionType.MINT_AKS
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

    @Prop({ required: true })
    transactionId: string;

    @Prop()
    error: string;

}

export const BlockchainTransactionSchema = SchemaFactory.createForClass(BlockchainTransaction);