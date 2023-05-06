import { OnQueueError, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { NftType } from '@app/shared-library/shared-library.main';
import { InjectModel } from '@nestjs/mongoose';
import { CollectionItem, CollectionItemDocument, MarketplaceState } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { MarketplaceListingJob, WorkersMarketplace } from "@app/shared-library/workers/workers.marketplace";
import { Model } from 'mongoose';

@Processor(WorkersMarketplace.MarketplaceListingQueue)
export class QueueMarketplaceListingProcessor {

    private readonly logger = new Logger(QueueMarketplaceListingProcessor.name);

    constructor(
        @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>) {
    }

    @Process()
    async process(job: Job<MarketplaceListingJob>) {
        const collectionItem = await this.collectionItemModel.findOne({
            contractAddress: job.data.contractAddress,
            tokenId: job.data.tokenId,
            marketplaceState: {
                '$ne': MarketplaceState.SOLD
            }
        });

        if (collectionItem) {
            collectionItem.marketplaceState = job.data.listed ? MarketplaceState.LISTED : MarketplaceState.NONE;
            await collectionItem.save();
            this.logger.log(`Job finished! ${this.jobInfo(job)}`);
        } else {
            throw Error('Unable to find collection item');
        }
    }

    @OnQueueError()
    onQueueError(error: Error) {
        this.logger.error(error);
    }

    @OnQueueFailed()
    onQueueFailed(job: Job<MarketplaceListingJob>, error: Error) {
        this.logger.error(`Job failed ${this.jobInfo(job)}`, error);
    }

    private jobInfo(job: Job<MarketplaceListingJob>) {
        return `${job.id} ${job.data.tokenId} ${job.data.listed} ${NftType[job.data.nftType]}`
    }
}