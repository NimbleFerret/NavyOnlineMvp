// ---------------------------------
// Main
// ---------------------------------

console.log('Fishing - 1');
console.log('Resources - 2');
console.log();

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('What to test ? ', input => {
    console.log();

    if (input == '1') {
        for (let i = 0; i < fishingAttempts; i++) {
            fishing();
        }

        const fishingMinutesSpent = (fishingAttempts * fishingDefaultTimeSec) / 60;
        const fishingHoursSpent = (fishingMinutesSpent / 60).toFixed(2);

        console.log('Fishing attempts: ' + fishingAttempts + ', time spent: ' + fishingMinutesSpent + ' mins, ' + fishingHoursSpent + ' hrs');
        console.log('Supplies 1: ' + fishOutSupplies1);
        console.log('Supplies 2: ' + fishOutSupplies2);
        console.log('Repairs: ' + fishOutRepair);
        console.log('Sticks: ' + fishOutStick);
        console.log('Island maps: ' + fishOutIslandMap);
        console.log('Boss maps: ' + fishOutBossMap);
        console.log('Loot boxes: ' + fishOutLootBox);
    } else if (input == '2') {
        for (let i = 0; i < resourceGatherAttempts; i++) {
            switch (gatherResource()) {
                case legendaryRarity:
                    legendaryResourcesGathered++;
                    break;
                case epicRarity:
                    epicResourcesGathered++;
                    break;
                case rareRarity:
                    rareResourcesGathered++;
                    break;
                case commonRarity:
                    commonResourcesGathered++;
                    break;
            }
        }

        console.log('Resource gathering attempts: ' + resourceGatherAttempts);
        console.log('Legendary resources: ' + legendaryResourcesGathered);
        console.log('Epic resources: ' + epicResourcesGathered);
        console.log('Rare resources: ' + rareResourcesGathered);
        console.log('Common resources: ' + commonResourcesGathered);
    } else {
        console.log('Error, run again.');
    }

    console.log();

    readline.close();
});

// ---------------------------------
// Common
// ---------------------------------

const legendaryRarity = 'legendary';
const epicRarity = 'epic';
const rareRarity = 'rare';
const commonRarity = 'common';

// ---------------------------------
// Fishing
// ---------------------------------

let fishOutSupplies1 = 0;
let fishOutSupplies2 = 0;
let fishOutRepair = 0;
let fishOutStick = 0;
let fishOutIslandMap = 0;
let fishOutBossMap = 0;
let fishOutLootBox = 0;

const fishingDefaultTimeSec = 60;
const fishingAttempts = 10;
const fishingChance = {
    Supplies1: 40,
    Supplies2: 21,
    Repair: 10,
    Stick: 20,
    IslandMap: 4,
    BossMap: 4,
    LootBox: 1
}

function fishing() {
    if (Probability(fishingChance.Supplies2)) {
        fishOutSupplies2++;
        return;
    }
    if (Probability(fishingChance.Repair)) {
        fishOutRepair++;
        return;
    }
    if (Probability(fishingChance.Stick)) {
        fishOutStick++;
        return;
    }
    if (Probability(fishingChance.IslandMap)) {
        fishOutIslandMap++;
        return;
    }
    if (Probability(fishingChance.BossMap)) {
        fishOutBossMap++;
        return;
    }
    if (Probability(fishingChance.LootBox)) {
        fishOutLootBox++;
        return;
    }
    fishOutSupplies1++;
    return;
}

// ---------------------------------
// Resources
// ---------------------------------

let legendaryResourcesGathered = 0;
let epicResourcesGathered = 0;
let rareResourcesGathered = 0;
let commonResourcesGathered = 0;

const gatheringTools = new Map();
gatheringTools.set(commonRarity, {
    attempts: 130, chanceBonus: 0
});
gatheringTools.set(rareRarity, {
    attempts: 210, chanceBonus: 5
});
gatheringTools.set(epicRarity, {
    attempts: 340, chanceBonus: 8
});
gatheringTools.set(legendaryRarity, {
    attempts: 550, chanceBonus: 13
});

const myGatheringTool = gatheringTools.get(commonRarity);
const resourceGatherAttempts = myGatheringTool.attempts;
const resourceRarityChance = {
    Legendary: 0.1,
    Epic: 3.4,
    Rare: 13.5,
    Common: 83
}

function gatherResource() {
    if (Probability(resourceRarityChance.Legendary)) {
        legendaryResourcesGathered++;
        return;
    }
    if (Probability(resourceRarityChance.Epic)) {
        epicResourcesGathered++;
        return;
    }
    if (Probability(resourceRarityChance.Rare)) {
        rareResourcesGathered++;
        return;
    }
    commonResourcesGathered++;
    return;
}

// ---------------------------------
// Random
// ---------------------------------

function GetRandomIntInRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Probability(chance) {
    if (chance >= 100) {
        return true;
    } else if (chance <= 0) {
        return false;
    }

    let result = false;
    const iterations = 100 / chance;
    const rnd = GetRandomIntInRange(1, iterations);
    if (rnd == 1) {
        result = true;
    }
    return result;
}

function random(options) {
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