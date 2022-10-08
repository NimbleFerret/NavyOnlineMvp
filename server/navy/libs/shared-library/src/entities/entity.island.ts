export interface IslandEntity {
    id: string;
    owner: string;
    level: number;
    size: number;
    rarity: number;
    terrain: string;
    miningRewardNVY: number;
    shipAndCaptainFee: number;
    maxMiners: number;
    miners: number;
    minersFee: number;
    mining: boolean;
    x: number;
    y: number;
}