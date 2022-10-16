export interface CaptainEntity {
    id: string;
    owner: string;
    type: number;
    miningRewardNVY: number;
    stakingRewardNVY: number;
    miningStartedAt: number;
    miningDurationSeconds: number;
    traits: number;
    level: number;
    rarity: number;
    bg: number;
    acc: number;
    head: number;
    haircutOrHat: number;
    clothes: number;
}