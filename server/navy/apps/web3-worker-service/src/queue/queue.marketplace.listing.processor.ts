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
            if (!job.data.sold) {
                if (job.data.listed) {
                    collectionItem.marketplaceState = MarketplaceState.LISTED;
                    collectionItem.price = job.data.price;
                } else {
                    collectionItem.marketplaceState = MarketplaceState.NONE;
                    collectionItem.price = undefined;
                }
            } else {
                const soldCollectionItem = new this.collectionItemModel();
                soldCollectionItem.id = collectionItem.id;
                soldCollectionItem.tokenId = collectionItem.tokenId;
                soldCollectionItem.tokenUri = collectionItem.tokenUri;
                soldCollectionItem.seller = job.data.seller.toLowerCase();
                soldCollectionItem.owner = job.data.owner.toLowerCase();
                soldCollectionItem.price = job.data.price;
                soldCollectionItem.image = collectionItem.image;
                soldCollectionItem.visuals = collectionItem.visuals;
                soldCollectionItem.traits = collectionItem.traits;
                soldCollectionItem.rarity = collectionItem.rarity;
                soldCollectionItem.lastUpdated = Date.now();
                soldCollectionItem.needUpdate = collectionItem.needUpdate;
                soldCollectionItem.contractAddress = collectionItem.contractAddress;
                soldCollectionItem.collectionName = collectionItem.collectionName;
                soldCollectionItem.chainId = collectionItem.chainId;
                soldCollectionItem.chainName = collectionItem.chainName;
                soldCollectionItem.coinSymbol = collectionItem.coinSymbol;
                soldCollectionItem.marketplaceState = MarketplaceState.SOLD;
                soldCollectionItem.collectionName = 'captains';
                await soldCollectionItem.save();

                collectionItem.marketplaceState = MarketplaceState.NONE;
                collectionItem.owner = job.data.owner;
                collectionItem.seller = job.data.seller;
                collectionItem.price = undefined;
            }
            await collectionItem.save();
            this.logger.log(`Job finished! (${this.jobInfo(job)}) tokenId: ${collectionItem.tokenId}`);
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
        return `${job.id} ${job.data.tokenId} ${job.data.listed} ${NftType[job.data.nftType]} ${job.data.price} ${job.data.sold}`
    }
}