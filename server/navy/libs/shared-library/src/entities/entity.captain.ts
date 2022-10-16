export interface CaptainEntity {
    id: string;
    owner: string;
    type: string;
    miningRewardNVY: number;
    stakingRewardNVY: number;
    miningStartedAt: number;
    miningDurationSeconds: number;
    traits: number;
    level: number;
    rarity: string;
    bg: number;
    acc: number;
    head: number;
    haircutOrHat: number;
    clothes: number;
}