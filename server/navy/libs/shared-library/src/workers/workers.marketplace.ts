import { MarketplaceState } from "../schemas/marketplace/schema.collection.item";
import { NftType, Rarity } from "../shared-library.main";

export interface NftSubPartDetails {
    index: number;
    chance: number;
    rarity: Rarity;
    filePath?: string;
}

export interface NftPartDetails {
    resPlural: string;
    resSingle: string;
    subParts: NftSubPartDetails[];
}

export interface MarketplaceUpdateJob {
    marketplaceState: MarketplaceState;
    nftType: NftType;
}

export interface MarketplaceListingJob {
    contractAddress: string;
    tokenId: number;
    listed: boolean;
    nftType: NftType;
    price: number;
}

export class WorkersMarketplace {

    public static readonly MarketplaceUpdateQueue = 'MarketplaceUpdateQueue';
    public static readonly MarketplaceListingQueue = 'MarketplaceListingQueue';

}