// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library NVYGameLibrary {
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
        uint256 minAccStep;
        uint256 maxAccStep;
        uint256 minAccDelay;
        uint256 maxAccDelay;
        uint256 minRotationDelay;
        uint256 maxRotationDelay;
        uint256 minCannonsOnSide;
        uint256 maxCannonsOnSide;
        uint256 minCannonsRange;
        uint256 maxCannonsRange;
        uint256 minCannonballDamage;
        uint256 maxCannonballDamage;
    }

    struct ShipStats {
        uint256 armor;
        uint256 hull;
        uint256 maxSpeed;
        uint256 accelerationStep;
        uint256 accelerationDelay;
        uint256 rotationDelay;
        uint256 cannonsOnSide;
        uint256 cannonsRange;
        uint256 cannonballDamage;
        uint256 level;
        ShipSize size;
    }

    struct IslandStats {
        uint256 reward;
        uint256 rewardDelaySeconds;
        uint256 rewardLastAttemptTime;
        uint256 level;
    }

    //

    enum TaskType {
        DAILY,
        WEEKLY
    }

    enum TaskReward {
        NVY,
        AKS
    }

    enum TaskGoal {
        KILL_PLAYERS,
        KILL_MOBS,
        KILL_BOSES
    }

    //

    uint256 constant maxShipLevel = 10;
}
