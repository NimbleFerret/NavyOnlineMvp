import { NftType } from "../shared-library.main";

export interface MintJob {
    nftType: NftType;
    sender: string;
    contractAddress: string;
    tokenId?: number;
}

export class WorkersMint {
    public static readonly MintQueue = 'MintQueue';
}