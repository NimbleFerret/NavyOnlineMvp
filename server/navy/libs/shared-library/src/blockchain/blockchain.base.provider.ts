import { Logger } from "@nestjs/common";
import { Queue } from "bull";
import { MarketplaceState } from "../schemas/marketplace/schema.collection.item";
import { NftType } from "../shared-library.main";
import { SharedLibraryService } from "../shared-library.service";
import { MarketplaceListingJob, MarketplaceSetSalePriceJob, MarketplaceSoldJob, MarketplaceUpdateJob } from "../workers/workers.marketplace";
import { MintJob } from "../workers/workers.mint";

export interface NftMintedEventParams {
    owner: string;
}

export interface NftGeneratedEventParams {
    nftId?: number;
    nftAddress?: string;
    owner: string;
}

export interface NftListedEventParams {
    nftId?: number;
    nftAddress?: string;
    seller: string;
    owner: string;
    price?: number;
}

export interface NftDelistedEventParams {
    nftId?: number;
    nftAddress?: string;
    seller: string;
}

export interface NftSoldEventParams {
    nftId?: number;
    nftAddress?: string;
    owner: string;
    seller: string;
    price: number;
}

export interface NftSalePriceSetEventParams {
    nftAddress: string;
    seller: string;
    price: number;
}

export class BlockchainBaseProcessor {

    constructor(
        private chainName: string,
        private readonly mintQueue: Queue,
        private readonly marketplaceUpdateQueue: Queue,
        private readonly marketplaceListingQueue: Queue,
        private readonly marketplaceSoldQueue: Queue,
        private readonly marketplaceSetSalePriceQueue?: Queue) {
    }

    async processNftMintedEvent(nftType: NftType, event: NftMintedEventParams) {
        event.owner.toLowerCase();

        Logger.log(`${BlockchainBaseProcessor.NftTypeToString(nftType)} mint occured on ${this.chainName} chain! Owner: ${event.owner}`);

        this.mintQueue.add({
            nftType,
            chainName: this.chainName,
            owner: event.owner
        } as MintJob);
    }

    async processNftGeneratedEvent(nftType: NftType, event: NftGeneratedEventParams) {
        // Add it later
    }

    async processNftListedEvent(nftType: NftType, event: NftListedEventParams) {
        event.owner.toLowerCase();
        event.seller.toLowerCase();

        const nftString = 'nft: ' + this.chainName == SharedLibraryService.VENOM_CHAIN_NAME ?
            event.nftAddress : event.nftId;
        const ownerString = 'owner: ' + event.owner;
        const sellerString = 'seller: ' + event.seller;
        const priceString = this.chainName == SharedLibraryService.CRONOS_CHAIN_NAME ? ' , price: ' + event.price : '';

        Logger.log(`${BlockchainBaseProcessor.NftTypeToString(nftType)} listed on the ${this.chainName} marketplace! ${nftString}, ${ownerString}, ${sellerString}${priceString}`);

        const queueJobData: MarketplaceListingJob = {
            chainName: this.chainName,
            nftType,
            seller: event.seller,
            owner: event.owner,
            listed: true
        };

        if (this.chainName == SharedLibraryService.VENOM_CHAIN_NAME) {
            queueJobData.nftAddress = event.nftAddress.toLowerCase();
        } else {
            queueJobData.nftId = event.nftId;
            queueJobData.price = event.price;
        }

        await this.marketplaceListingQueue.add(queueJobData);
    }

    async processNftDelistedEvent(nftType: NftType, event: NftDelistedEventParams) {
        event.seller.toLowerCase();

        const nftString = 'nft: ' + this.chainName == SharedLibraryService.VENOM_CHAIN_NAME ?
            event.nftAddress : event.nftId;
        const sellerString = 'seller: ' + event.seller;

        Logger.log(`${BlockchainBaseProcessor.NftTypeToString(nftType)} delisted from the ${this.chainName} marketplace! ${nftString}, ${sellerString}`);

        const queueJobData: MarketplaceListingJob = {
            chainName: this.chainName,
            nftType,
            seller: event.seller,
            listed: false
        };

        if (this.chainName == SharedLibraryService.VENOM_CHAIN_NAME) {
            queueJobData.nftAddress = event.nftAddress.toLowerCase();
        } else {
            queueJobData.nftId = event.nftId;
        }

        await this.marketplaceListingQueue.add(queueJobData);
    }

    async processNftSoldEvent(nftType: NftType, event: NftSoldEventParams) {
        event.owner.toLowerCase();
        event.seller.toLowerCase();

        const nftString = 'nft: ' + this.chainName == SharedLibraryService.VENOM_CHAIN_NAME ?
            event.nftAddress : event.nftId;
        const ownerString = 'owner: ' + event.owner;
        const sellerString = 'seller: ' + event.seller;
        const priceString = 'price: ' + event.price;

        Logger.log(`${BlockchainBaseProcessor.NftTypeToString(nftType)} sold on the ${this.chainName} marketplace! ${nftString}, ${ownerString}, ${sellerString}, ${priceString}`);

        const queueJobData: MarketplaceSoldJob = {
            chainName: this.chainName,
            nftType,
            seller: event.seller,
            owner: event.owner,
            price: event.price
        };

        if (this.chainName == SharedLibraryService.VENOM_CHAIN_NAME) {
            queueJobData.nftAddress = event.nftAddress.toLowerCase();
        } else {
            queueJobData.nftId = event.nftId;
        }

        await this.marketplaceSoldQueue.add(queueJobData);
    }

    async processNftSalePriceSetEvent(nftType: NftType, event: NftSalePriceSetEventParams) {
        event.seller.toLowerCase();
        event.nftAddress.toLowerCase();

        const nftString = 'nft: ' + event.nftAddress;
        const sellerString = 'seller: ' + event.seller;
        const priceString = 'price: ' + event.price;

        Logger.log(`${BlockchainBaseProcessor.NftTypeToString(nftType)} price set on the ${this.chainName} marketplace! ${nftString}, ${sellerString}, ${priceString}`);

        const queueJobData: MarketplaceSetSalePriceJob = {
            chainName: this.chainName,
            nftType,
            nftAddress: event.nftAddress,
            seller: event.seller,
            price: event.price
        };

        await this.marketplaceSetSalePriceQueue.add(queueJobData);
    }

    async syncMarketplaceState(marketplaceState: MarketplaceState) {
        await this.marketplaceUpdateQueue.empty();
        await this.marketplaceUpdateQueue.add({
            chainName: this.chainName,
            marketplaceState,
            nftType: NftType.CAPTAIN
        } as MarketplaceUpdateJob);
    }

    public static NftTypeToString(nftType: NftType) {
        switch (nftType) {
            case NftType.CAPTAIN:
                return 'Captains';
            case NftType.SHIP:
                return 'Ships';
            case NftType.ISLAND:
                return 'Islands';
        }
    }

}