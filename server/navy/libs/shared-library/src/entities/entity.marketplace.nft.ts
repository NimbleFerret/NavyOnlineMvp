export interface MarketplaceNFT {
    contractAddress: string;
    tokenId: number;
    tokenUri: string;
    seller: string;
    owner: string;
    price: string;
    image: string;
    traits: any;
    lastUpdated: number;
}