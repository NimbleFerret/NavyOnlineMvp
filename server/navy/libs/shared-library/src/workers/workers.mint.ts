import { NftType } from "../shared-library.main";

export interface MintJob {
    nftType: NftType;
    owner: string;
    chainName: string;
    tokenId?: number;
}

export class WorkersMint {
    public static readonly CronosMintQueue = 'CronosMintQueue';
    public static readonly VenomMintQueue = 'VenomMintQueue';
}