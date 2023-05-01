export interface NftPart {
    name: string,
    index: number
}

export interface GenerateNftImageDto {
    collectionName: string,
    index: number,
    nftParts?: NftPart[]
}