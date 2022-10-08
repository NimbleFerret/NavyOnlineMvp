import { Logger } from '@nestjs/common';
import {
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ethers } from 'ethers';
import { EthersProvider } from './blockchain.ethers.provider';
import {
    BlockchainTransaction,
    BlockchainTransactionDocument,
    BlockchainTransactionDto,
    TransactionStatus,
    TransactionType
} from './schemas/schema.blockchain.transaction';

export interface JobData {
    id: string;
    recipient: string;
    transactionType: TransactionType;
}

export interface TokenJobData extends JobData {
    amount: number;
}

export interface NFTJobData extends JobData {
    tuple: any;
    metadata: string;
}

@Processor('blockchain')
export class BlockchainQueueProcessor {

    public static readonly MINT_TOKEN_QUEUE = 'mintToken';
    public static readonly MINT_NFT_QUEUE = 'mintNFT';

    private readonly logger = new Logger(BlockchainQueueProcessor.name);

    constructor(
        private readonly ethersProvider: EthersProvider,
        @InjectModel(BlockchainTransaction.name) private blockchainTransactionModel: Model<BlockchainTransactionDocument>) { }

    @Process(BlockchainQueueProcessor.MINT_TOKEN_QUEUE)
    async mintToken(job: Job<TokenJobData>) {
        const amount = job.data.amount;
        const recipient = job.data.recipient;

        this.logger.log(`${this.transactionTypeToSimplifiedString(job.data.transactionType)} started, tx: ${job.data.id}, type: ${job.data.transactionType}, recipient: ${recipient}, amount: ${amount}`);

        const mintTransaction = new this.blockchainTransactionModel({
            transactionType: job.data.transactionType,
            transactionStatus: TransactionStatus.CREATED,
            transactionDetails: {
                amount,
                recipient
            },
            transactionId: job.data.id
        } as BlockchainTransactionDto);
        await mintTransaction.save();

        switch (job.data.transactionType) {
            case TransactionType.MINT_AKS: {
                await this.ethersProvider.aksContract.mintReward(recipient, ethers.BigNumber.from(amount));
                break;
            }
            case TransactionType.MINT_NVY_INGAME: {
                await this.ethersProvider.nvyContract.mintRewardIngame(recipient, ethers.BigNumber.from(amount));
                break;
            }
            case TransactionType.MINT_NVY_ISLAND: {
                await this.ethersProvider.nvyContract.mintRewardIsland(recipient, ethers.BigNumber.from(amount));
                break;
            }
        }
    }

    @Process(BlockchainQueueProcessor.MINT_NFT_QUEUE)
    async mintNFT(job: Job<NFTJobData>) {
        const recipient = job.data.recipient;

        this.logger.log(`${this.transactionTypeToSimplifiedString(job.data.transactionType)} started, tx: ${job.data.id}, type: ${job.data.transactionType}, recipient: ${recipient}`);

        const mintTransaction = new this.blockchainTransactionModel({
            transactionType: job.data.transactionType,
            transactionStatus: TransactionStatus.CREATED,
            transactionDetails: {
                metadata: job.data.metadata,
                recipient
            },
            transactionId: job.data.id
        } as BlockchainTransactionDto);
        await mintTransaction.save();

        const tuple = job.data.tuple;
        const metadata = job.data.metadata;

        switch (job.data.transactionType) {
            case TransactionType.MINT_FOUNDERS_CAPTAIN: {
                await this.ethersProvider.captainContract.grantCaptain(recipient, tuple, metadata);
                break;
            }
            case TransactionType.MINT_FOUNDERS_SHIP: {
                await this.ethersProvider.shipContract.grantShip(recipient, tuple, metadata);
                break;
            }
            case TransactionType.MINT_FOUNDERS_ISLAND: {
                await this.ethersProvider.islandContract.grantIsland(recipient, tuple, metadata);
                break;
            }
        }
    }

    @OnQueueCompleted()
    async completed(job: Job<JobData>, result: any) {
        this.logger.log(`${this.transactionTypeToSimplifiedString(job.data.transactionType)} completed, tx: ${job.data.id}`);
        await this.updateTransactionStatus(job.data.id, TransactionStatus.COMPLETED);
    }

    @OnQueueFailed()
    async failed(job: Job<JobData>, err: Error) {
        this.logger.error(`${this.transactionTypeToSimplifiedString(job.data.transactionType)} failed, tx: ${job.data.id}, reason: ${err.message}`);
        await this.updateTransactionStatus(job.data.id, TransactionStatus.FAILED, err);
    }

    private async updateTransactionStatus(id: string, transactionStatus: TransactionStatus, err?: Error) {
        const transaction = await this.blockchainTransactionModel.findOne({ transactionId: id });
        if (transaction) {
            transaction.transactionStatus = transactionStatus;
            if (err) {
                transaction.error = err.message;
            }
            await transaction.save();
        } else {
            this.logger.error(`Unable to update transaction by id: ${id}`);
        }
    }

    private transactionTypeToSimplifiedString(transactionType: TransactionType) {
        switch (transactionType) {
            case TransactionType.MINT_AKS:
            case TransactionType.MINT_NVY_INGAME:
            case TransactionType.MINT_NVY_ISLAND:
                return 'Token minting';
            case TransactionType.MINT_FOUNDERS_CAPTAIN:
                return 'Founders captain minting';
            case TransactionType.MINT_FOUNDERS_SHIP:
                return 'Founders ship minting';
            case TransactionType.MINT_FOUNDERS_ISLAND:
                return 'Founders island minting';
        }
    }
}