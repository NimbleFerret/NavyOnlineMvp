
import { NftType } from "@app/shared-library/shared-library.main";
import { MintJob } from "@app/shared-library/workers/workers.mint";
import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueError,
    OnQueueFailed,
    Process
} from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { NftGenerator } from "./nft/nft.generator";
import { Job } from "bull";
import { Model } from "mongoose";
import {
    BlockchainTransactionDocument,
    TransactionStatus,
    BlockchainTransactionDto,
    TransactionType
} from '@app/shared-library/schemas/blockchain/schema.blockchain.transaction';
import { CronosConstants } from "@app/shared-library/blockchain/cronos/cronos.constants";
import { SharedLibraryService } from "@app/shared-library";
import { VenomConstants } from "@app/shared-library/blockchain/venom/venom.constants";

export abstract class QueueMintBaseProcessor {

    private readonly logger: Logger;
    nftCaptainGenerator: NftGenerator;

    constructor(
        private chainName: string,
        private blockchainTransactionModel: Model<BlockchainTransactionDocument>,
    ) {
        this.logger = new Logger(chainName.toUpperCase() + ' MINT PROCESSOR');
    }

    // --------------------------------
    // Abstract methods
    // --------------------------------

    abstract getCollectionTotalSupply(nftType: NftType): Promise<number>;
    abstract getCollectionCurrentSupply(nftType: NftType): Promise<number>;

    // --------------------------------
    // Queue methods
    // --------------------------------

    @Process()
    async process(job: Job<MintJob>) {
        let nftGenerator: NftGenerator;
        // let collectionContract: Contract;
        // let collectionSaleContract: Contract;

        switch (job.data.nftType) {
            case NftType.CAPTAIN:
                nftGenerator = this.nftCaptainGenerator;
                break;
        }

        const totalSupply = await this.getCollectionTotalSupply(job.data.nftType);
        let tokenIndex = await this.getCollectionCurrentSupply(job.data.nftType) + 1;
        if (job.data.tokenId) {
            tokenIndex = job.data.tokenId;
        }

        const metadataUrl = await this.nftCaptainGenerator.generateNftAndUpload(tokenIndex, totalSupply);

        await this.nftCaptainGenerator.mintAndSaveNft(job.data.owner, metadataUrl, job.data.chainName == SharedLibraryService.VENOM_CHAIN_NAME ? VenomConstants.CaptainsCollectionContractAddress : CronosConstants.CaptainContractAddress);
    }

    @OnQueueError()
    onQueueError(error: Error) {
        this.logger.error(error);
    }

    @OnQueueActive()
    async onQueueActive(job: Job<MintJob>) {
        this.logger.log(`Processing job ${this.jobInfo(job)}`);
        await this.saveTransaction(job, TransactionStatus.CREATED);
    }

    @OnQueueCompleted()
    async onQueueCompleted(job: Job<MintJob>, result: any) {
        this.logger.log(`Job completed ${this.jobInfo(job)}`);
        await this.saveTransaction(job, TransactionStatus.COMPLETED);
    }

    @OnQueueFailed()
    async onQueueFailed(job: Job<MintJob>, error: Error) {
        this.logger.error(`Job failed ${this.jobInfo(job)}`, error);
        await this.saveTransaction(job, TransactionStatus.FAILED, error.message);
    }

    private jobInfo(job: Job<MintJob>) {
        return `${job.id} ${NftType[job.data.nftType]} ${job.data.owner}`;
    }

    private async saveTransaction(job: Job<MintJob>, transactionStatus: TransactionStatus, errorMessage?: string) {
        let transactionType: TransactionType;
        switch (job.data.nftType) {
            case NftType.CAPTAIN:
                transactionType = TransactionType.MINT_CAPTAIN;
                break;
            case NftType.SHIP:
                transactionType = TransactionType.MINT_SHIP;
                break;
            case NftType.ISLAND:
                transactionType = TransactionType.MINT_ISLAND;
                break;
        }

        const mintTransaction = new this.blockchainTransactionModel({
            transactionType,
            transactionStatus,
            transactionDetails: {
                sender: job.data.owner,
                nftType: job.data.nftType,
                chainName: job.data.chainName,
                jobId: job.id
            }
        } as BlockchainTransactionDto);
        if (errorMessage && transactionStatus == TransactionStatus.FAILED) {
            mintTransaction.errorMessage = errorMessage;
        }
        await mintTransaction.save();
    }
}