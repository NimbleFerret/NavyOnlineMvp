import { Injectable } from '@nestjs/common';
import { CaptainEntity } from './entities/entity.captain';
import { ShipEntity } from './entities/entity.ship';
import { ShipSize, Rarity, AssetType } from './shared-library.main';

export interface SelectPercentageOptions<T> {
    value: T;
    percentage: number;
}

@Injectable()
export class SharedLibraryService {

    public static readonly GENERAL_ERROR = 1;
    public static readonly NOT_FOUND_ERROR = 2;
    public static readonly ALREADY_EXISTS_ERROR = 3;
    public static readonly BAD_PARAMS = 4;
    public static readonly UNABLE_TO_GENERATE_CONFIRMATION_CODE = 5;
    public static readonly CONFIRMATION_CODE_MISSMATCH = 6;
    public static readonly CONFIRMATION_CODE_EXPIRED = 7;

    public static readonly WORLD_SIZE = 15;
    public static readonly BASE_POS_X = 5;
    public static readonly BASE_POS_Y = 5;

    // -------------------------------------
    // Random and chances
    // -------------------------------------

    public static readonly RARITY_COMMON_CHANCE = 48;
    public static readonly RARITY_RARE_CHANCE = 34;
    public static readonly RARITY_EPIC_CHANCE = 13;
    public static readonly RARITY_LEGENDARY_CHANCE = 5;

    public static GenerateRarity() {
        if (SharedLibraryService.Probability(SharedLibraryService.GetRandomIntInRange(1, SharedLibraryService.RARITY_LEGENDARY_CHANCE))) {
            return Rarity.LEGENDARY;
        }
        if (SharedLibraryService.Probability(SharedLibraryService.GetRandomIntInRange(1, SharedLibraryService.RARITY_EPIC_CHANCE))) {
            return Rarity.EPIC;
        }
        if (SharedLibraryService.Probability(SharedLibraryService.GetRandomIntInRange(1, SharedLibraryService.RARITY_RARE_CHANCE))) {
            return Rarity.RARE;
        }
        return Rarity.COMMON;
    }

    public static SelectItemByPercentage<T>(options: SelectPercentageOptions<T>[]) {
        options = options.sort((a, b) => a.percentage - b.percentage);

        let random = Math.floor(Math.random() * 100);

        for (const option of options) {
            if (random <= option.percentage) {
                return option.value;
            }
            random -= option.percentage;
        }

        return options[options.length - 1].value;
    }

    public static Probability(chance: number) {
        if (chance >= 100) {
            return true;
        } else if (chance <= 0) {
            return false;
        }

        let result = false;
        const iterations = 100 / chance;
        const rnd = SharedLibraryService.GetRandomIntInRange(1, iterations);
        if (rnd == 1) {
            result = true;
        }
        return result;
    }

    public static GetRandomIntInRange(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // public static GetFreeShip() {
    //     return {
    //         id: 'free',
    //         armor: 300,
    //         hull: 300,
    //         maxSpeed: 150,
    //         accelerationStep: 50,
    //         accelerationDelay: 200,
    //         rotationDelay: 200,
    //         fireDelay: 500,
    //         cannons: 2,
    //         cannonsRange: 500,
    //         cannonsDamage: 20,
    //         level: 0,
    //         traits: 0,
    //         type: AssetType.FREE,
    //         size: ShipSize.SMALL,
    //         rarity: Rarity.COMMON,
    //         windows: 0,
    //         anchor: 0,
    //         currentIntegrity: 0,
    //         maxIntegrity: 0
    //     } as ShipEntity;
    // }

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
