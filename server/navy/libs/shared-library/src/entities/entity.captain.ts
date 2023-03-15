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

export class CaptainEntity {

    public static GetFreeCaptainStats(id: string, ownerId: string) {
        const captain: CaptainObjectEntity = {
            x: 100,
            y: 207,
            id,
            ownerId,
            acceleration: 50,
            minSpeed: 0,
            maxSpeed: 300,
            currentSpeed: 0,
            movementDelay: 0.100,
            //
            type: 0,
            miningRewardNVY: 0,
            stakingRewardNVY: 0,
            miningStartedAt: 0,
            miningDurationSeconds: 0,
            traits: 0,
            level: 0,
            rarity: 0,
            bg: 0,
            acc: 0,
            head: 0,
            haircutOrHat: 0,
            clothes: 0
        };
        return captain;
    }

}