import { BaseGameObject } from "./entity.base";

export interface CaptainObjectEntity extends BaseGameObject {
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