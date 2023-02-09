import { Injectable } from '@nestjs/common';
import { CaptainEntity } from './entities/entity.captain';
import { ShipEntity } from './entities/entity.ship';
import { ShipSize, Rarity, AssetType } from './shared-library.main';

@Injectable()
export class SharedLibraryService {

    public static readonly GENERAL_ERROR = 1;
    public static readonly NOT_FOUND_ERROR = 2;
    public static readonly ALREADY_EXISTS_ERROR = 3;
    public static readonly BAD_PARAMS = 4;

    public static readonly WORLD_SIZE = 15;
    public static readonly BASE_POS_X = 5;
    public static readonly BASE_POS_Y = 5;

    public static GetRandomIntInRange(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static GetFreeShip() {
        return {
            id: 'free',
            armor: 300,
            hull: 300,
            maxSpeed: 150,
            accelerationStep: 50,
            accelerationDelay: 200,
            rotationDelay: 200,
            fireDelay: 500,
            cannons: 2,
            cannonsRange: 500,
            cannonsDamage: 20,
            level: 0,
            traits: 0,
            type: AssetType.FREE,
            size: ShipSize.SMALL,
            rarity: Rarity.COMMON,
            windows: 0,
            anchor: 0,
            currentIntegrity: 0,
            maxIntegrity: 0
        } as ShipEntity;
    }

    public static GetFreeCaptain() {
        return {
            miningRewardNVY: 0,
            stakingRewardNVY: 0,
            miningStartedAt: 0,
            miningDurationSeconds: 0,
            traits: 0,
            level: 0,
            bg: 1,
            acc: 0,
            head: 3,
            haircutOrHat: 3,
            clothes: 3,
            type: AssetType.FREE,
            rarity: Rarity.COMMON
        } as CaptainEntity
    }

}
