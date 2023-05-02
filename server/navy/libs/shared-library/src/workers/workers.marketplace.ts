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

export interface UpdateMarketplaceJob {
    marketplaceState: MarketplaceState;
    nftType: NftType;
}

export class WorkersMarketplace {

    public static readonly UpdateMarketplaceQueue = 'UpdateMarketplaceQueue';

}