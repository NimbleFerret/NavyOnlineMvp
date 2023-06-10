import { Injectable } from '@nestjs/common';
import { Rarity } from './shared-library.main';

export interface SelectPercentageOptions<T> {
    value: T;
    percentage: number;
}

@Injectable()
export class SharedLibraryService {

    public static readonly CAPTAINS_COLLECTION_NAME = 'Captains';
    public static readonly SHIPS_COLLECTION_NAME = 'Ships';
    public static readonly ISLANDS_COLLECTION_NAME = 'Islands';

    public static readonly VENOM_CHAIN_ID = '1002';
    public static readonly VENOM_CHAIN_NAME = 'Venom';
    public static readonly VENOM_TOKEN_SYMBOL = 'V';

    public static readonly CRONOS_CHAIN_ID = '338';
    public static readonly CRONOS_CHAIN_NAME = 'Cronos';
    public static readonly CRONOS_TOKEN_SYMBOL = 'CRO';

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

    public static readonly RARITY_COMMON_CHANCE = 25
    public static readonly RARITY_RARE_CHANCE = 25;
    public static readonly RARITY_EPIC_CHANCE = 25;
    public static readonly RARITY_LEGENDARY_CHANCE = 25;

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

        return null;
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

    public static GetRandomIntInRangeExcept(min: number, max: number, except: number[]) {
        const result = SharedLibraryService.GetRandomIntInRange(min, max);
        if (except.includes(result)) {
            return SharedLibraryService.GetRandomIntInRangeExcept(min, max, except);
        } else {
            return result;
        }
    }

}
