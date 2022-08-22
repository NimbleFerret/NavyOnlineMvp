// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IShipTemplate.sol";
import "../NVYGameLibrary.sol";

contract ShipGenerator is AccessControl {
    struct ShipStatsStep {
        uint256 armor_hull_step;
        uint256 speed_acc_step;
        uint256 ms_delay_step;
        uint256 cannon_range_step;
        uint256 cannons_on_side_step;
        uint256 cannonball_damage_step;
    }
    ShipStatsStep public shipStatsStep;

    IShipTemplate private smallShipContract;
    IShipTemplate private mediumShipContract;
    IShipTemplate private largeShipContract;

    constructor() public {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        shipStatsStep = ShipStatsStep(100, 10, 50, 100, 1, 5);
    }

    function generateNewRandomShip()
        external
        returns (NVYGameLibrary.ShipStats memory)
    {
        // TODO add random size
        NVYGameLibrary.ShipSize shipSize = NVYGameLibrary.ShipSize(
            random(0, 1)
        );
        NVYGameLibrary.ShipStatsTemplate memory t = smallShipContract
            .getShipStats();

        return
            NVYGameLibrary.ShipStats(
                t.minArmor +
                    random(
                        1,
                        (t.maxArmor - t.minArmor) /
                            shipStatsStep.armor_hull_step
                    ) *
                    shipStatsStep.armor_hull_step,
                t.minHull +
                    random(
                        1,
                        (t.maxHull - t.minHull) / shipStatsStep.armor_hull_step
                    ) *
                    shipStatsStep.armor_hull_step,
                t.minMaxSpeed +
                    random(
                        1,
                        (t.maxMaxSpeed - t.minMaxSpeed) /
                            shipStatsStep.speed_acc_step
                    ) *
                    shipStatsStep.speed_acc_step,
                t.minAccStep +
                    random(
                        1,
                        (t.maxAccStep - t.minAccStep) /
                            shipStatsStep.speed_acc_step
                    ) *
                    shipStatsStep.speed_acc_step,
                t.minAccDelay +
                    random(
                        1,
                        (t.maxAccDelay - t.minAccDelay) /
                            shipStatsStep.ms_delay_step
                    ) *
                    shipStatsStep.ms_delay_step,
                t.minRotationDelay +
                    random(
                        1,
                        (t.maxRotationDelay - t.minRotationDelay) /
                            shipStatsStep.ms_delay_step
                    ) *
                    shipStatsStep.ms_delay_step,
                t.minCannonsOnSide +
                    random(
                        1,
                        (t.maxCannonsOnSide - t.minCannonsOnSide) /
                            shipStatsStep.cannons_on_side_step
                    ) *
                    shipStatsStep.cannons_on_side_step,
                t.minCannonsRange +
                    random(
                        1,
                        (t.maxCannonsRange - t.minCannonsRange) /
                            shipStatsStep.cannon_range_step
                    ) *
                    shipStatsStep.cannon_range_step,
                t.minCannonballDamage +
                    random(
                        1,
                        (t.maxCannonballDamage - t.minCannonballDamage) /
                            shipStatsStep.cannonball_damage_step
                    ) *
                    shipStatsStep.cannonball_damage_step,
                1,
                shipSize
            );
    }

    // --------------------------
    // Administration
    // --------------------------

    function updateShipStatsStep(ShipStatsStep memory steps)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        shipStatsStep = steps;
    }

    function updateSmallShipContractAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        smallShipContract = IShipTemplate(addr);
    }

    function updateMediumShipContractAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        mediumShipContract = IShipTemplate(addr);
    }

    function updateLargeShipContractAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        largeShipContract = IShipTemplate(addr);
    }

    // --------------------------
    // Random
    // --------------------------

    uint256 private nonce = 0;

    function random(uint256 min, uint256 max) internal returns (uint256) {
        uint256 randomnumber = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))
        ) % (max);
        randomnumber = randomnumber + min;
        nonce++;
        return randomnumber;
    }
}
