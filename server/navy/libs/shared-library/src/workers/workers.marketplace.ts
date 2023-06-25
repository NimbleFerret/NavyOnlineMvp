import { MarketplaceState } from "../schemas/marketplace/schema.collection.item";
import { NftType, Rarity } from "../shared-library.main";

export interface NftSubPartDetails {
    index?: number;
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
    chainName: string;
    marketplaceState: MarketplaceState;
    nftType: NftType;
}

export interface MarketplaceListingJob {
    chainName: string;
    nftId?: number; // Cronos
    nftAddress?: string; // Venom
    listed: boolean;
    nftType: NftType;
    price?: number;
    seller: string;
    owner?: string;
}

export interface MarketplaceSoldJob {
    chainName: string;
    nftId?: number; // Cronos
    nftAddress?: string; // Venom
    nftType: NftType;
    price: number;
    seller: string;
    owner: string;
}

export interface MarketplaceSetSalePriceJob {
    chainName: string;
    nftAddress: string;
    nftType: NftType;
    price: number;
    seller: string;
}

export interface MintJob {
    nftType: NftType;
    owner: string;
    chainName: string;
    tokenId?: number;
}

export class WorkersMarketplace {

    public static readonly CronosMarketplaceUpdateQueue = 'CronosMarketplaceUpdateQueue';
    public static readonly CronosMarketplaceListingQueue = 'CronosMarketplaceListingQueue';
    public static readonly CronosMarketplaceSoldQueue = 'CronosMarketplaceSoldQueue';

    public static readonly VenomMarketplaceUpdateQueue = 'VenomMarketplaceUpdateQueue';
    public static readonly VenomMarketplaceListingQueue = 'VenomMarketplaceListingQueue';
    public static readonly VenomMarketplaceSoldQueue = 'VenomMarketplaceSoldQueue';
    public static readonly VenomMarketplaceSetSalePriceQueue = 'VenomMarketplaceSetSalePriceQueue';

    public static readonly CronosMintQueue = 'CronosMintQueue';
    public static readonly VenomMintQueue = 'VenomMintQueue';

}