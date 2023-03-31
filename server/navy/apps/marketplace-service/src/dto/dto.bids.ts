export interface BidPlaceDto {
    contractAddress: string;
    tokenId: string;
    price: number;
    bidInitiatorAddress: string;
}

export interface BidDeleteDto {
    bidId: string;
}
