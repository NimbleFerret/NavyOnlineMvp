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
        bool mining;
        bool staking;
        uint256 miningRewardNVY;
        uint256 stakingRewardNVY;
        uint256 miningStartedAt;
        uint256 miningDurationSeconds;
        uint256 miningIsland;
    }

    // Ship stats

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
        bool maintenenceRequired;
        uint256 maintenenceCostNVY;
        uint256 maintenenceCostAKS;
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
        bool mining;
        uint256 miningStartedAt;
        uint256 miningDurationSeconds;
        uint256 miningRewardNVY;
        uint256 shipAndCaptainFee; // percent
        uint256 currMiners;
        uint256 maxMiners;
        uint256 minersFee; // percent
    }
}
