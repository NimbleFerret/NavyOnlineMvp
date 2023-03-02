import { NftType, Rarity } from "../shared-library.main";

export enum MarketplaceNftsType {
    LISTED,
    SOLD
}

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
    marketplaceNftsType: MarketplaceNftsType;
    nftType: NftType;
}

export class WorkersMarketplace {

    public static readonly UpdateMarketplaceQueue = 'UpdateMarketplaceQueue';

}