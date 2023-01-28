export interface IslandEntity {
    id: string;
    owner: string;
    level: number;
    size: number;
    rarity: number;
    terrain: number;
    miningRewardNVY: number;
    shipAndCaptainFee: number;
    maxMiners: number;
    miners: number;
    minersFee: number;
    mining: boolean;
    x: number;
    y: number;
}