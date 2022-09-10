// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library NVYGameLibrary {
    enum Rarity {
        COMMON,
        RARE,
        EPIC,
        LEGENDARY
    }

    struct UpgradeRequirementsByLevel {
        uint256 chance;
        uint256 nvy;
        uint256 aks;
    }

    // Ship and captain stats

    struct CaptainStats {
        uint256 level;
        uint256 traits;
        Rarity rarity;
    }

    enum ShipSize {
        SMALL,
        MEDIUM,
        LARGE
    }

    struct ShipStatsTemplate {
        uint256 minArmor;
        uint256 maxArmor;
        uint256 minHull;
        uint256 maxHull;
        uint256 minMaxSpeed;
        uint256 maxMaxSpeed;
        uint256 minAccelerationStep;
        uint256 maxAccelerationStep;
        uint256 minAccelerationDelay;
        uint256 maxAccelerationDelay;
        uint256 minRotationDelay;
        uint256 maxRotationDelay;
        uint256 minCannons;
        uint256 maxCannons;
        uint256 minCannonsRange;
        uint256 maxCannonsRange;
        uint256 minCannonsDamage;
        uint256 maxCannonsDamage;
    }

    struct ShipStatsStep {
        uint256 armorAndHullStep;
        uint256 speedAndAccelerationStep;
        uint256 inputdelayStep;
        uint256 cannonsStep;
        uint256 cannonsRangeStep;
        uint256 cannonsDamageStep;
    }

    struct ShipStats {
        uint256 armor;
        uint256 hull;
        uint256 maxSpeed;
        uint256 accelerationStep;
        uint256 accelerationDelay;
        uint256 rotationDelay;
        uint256 cannons;
        uint256 cannonsRange;
        uint256 cannonsDamage;
        uint256 level;
        uint256 traits;
        ShipSize size;
        Rarity rarity;
    }

    // Ship and captain upgrades & traits

    uint256 constant shipAndCaptainMaxLevel = 10;

    // Island stats

    enum IslandSize {
        SMALL,
        MEDIUM,
        LARGE,
        EXTRA_LARGE
    }

    uint256 constant islandMaxLevel = 3;

    struct IslandStats {
        uint256 reward;
        uint256 rewardDelaySeconds;
        uint256 rewardLastAttemptTime;
        uint256 fees;
        uint256 mines;
        uint256 level;
        IslandSize size;
        Rarity rarity;
    }
}
