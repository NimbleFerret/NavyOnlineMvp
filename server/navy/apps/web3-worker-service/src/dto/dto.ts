export interface NftPart {
    name: string,
    index: number
}

export interface GenerateNftImageDto {
    collectionName: string,
    amount: number,
    nftParts?: NftPart[]
}

export interface MintCaptainDto {
    owner: string;
}