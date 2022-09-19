// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "../NVYGameLibrary.sol";

contract ShipTemplate is AccessControl {
    NVYGameLibrary.ShipStatsStep shipStatsStep;
    NVYGameLibrary.ShipStatsTemplate smallShipStatsTemplate;
    NVYGameLibrary.ShipStatsTemplate middleShipStatsTemplate;
    NVYGameLibrary.ShipStatsTemplate largeShipStatsTemplate;

    constructor() public {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        // Default data
        shipStatsStep = NVYGameLibrary.ShipStatsStep(
            100, // armorAndHullStep
            10, // speedAndAccelerationStep
            10, // inputdelayStep
            1, // cannonsStep
            50, // cannonsRangeStep
            5, // cannonsDamageStep
            5 // integrityStep
        );

        smallShipStatsTemplate = NVYGameLibrary.ShipStatsTemplate(
            300, // minArmor
            1000, // maxArmor
            300, // minHull
            1000, // maxHull
            130, // minMaxSpeed
            250, // maxMaxSpeed
            20, // minAccStep
            80, // maxAccStep
            100, // minAccDelay
            200, // maxAccDelay
            100, // minRotationDelay
            250, // maxRotationDelay
            100, // minFireDelay
            500, // maxFireDelay
            1, // minCannonsOnSide
            2, // maxCannonsOnSide
            600, // minCannonsRange
            1000, // maxCannonsRange
            20, // minCannonballDamage
            50, // maxCannonballDamage
            15, // minIntegrity
            35 // maxIntegrity
        );

        middleShipStatsTemplate = NVYGameLibrary.ShipStatsTemplate(
            800, // minArmor
            1200, // maxArmor
            700, // minHull
            1200, // maxHull
            100, // minMaxSpeed
            250, // maxMaxSpeed
            20, // minAccStep
            80, // maxAccStep
            100, // minAccDelay
            5300, // maxAccDelay
            100, // minRotationDelay
            500, // maxRotationDelay
            100, // minFireDelay
            500, // maxFireDelay
            3, // minCannonsOnSide
            4, // maxCannonsOnSide
            700, // minCannonsRange
            1600, // maxCannonsRange
            20, // minCannonballDamage
            80, // maxCannonballDamage,
            25, // minIntegrity
            80 // maxIntegrity
        );

        largeShipStatsTemplate = NVYGameLibrary.ShipStatsTemplate(
            300, // minArmor
            1000, // maxArmor
            300, // minHull
            1000, // maxHull
            130, // minMaxSpeed
            250, // maxMaxSpeed
            20, // minAccStep
            80, // maxAccStep
            100, // minAccDelay
            200, // maxAccDelay
            100, // minRotationDelay
            250, // maxRotationDelay
            100, // minFireDelay
            500, // maxFireDelay
            3, // minCannonsOnSide
            5, // maxCannonsOnSide
            600, // minCannonsRange
            1000, // maxCannonsRange
            20, // minCannonballDamage
            50, // maxCannonballDamage
            50, // minIntegrity
            200 // maxIntegrity
        );
    }

    function getShipStatsStep()
        external
        view
        returns (NVYGameLibrary.ShipStatsStep memory)
    {
        return shipStatsStep;
    }

    function getSmallShipStats()
        external
        view
        returns (NVYGameLibrary.ShipStatsTemplate memory)
    {
        return smallShipStatsTemplate;
    }

    function getMiddleShipStats()
        external
        view
        returns (NVYGameLibrary.ShipStatsTemplate memory)
    {
        return middleShipStatsTemplate;
    }

    function getLargeShipStats()
        external
        view
        returns (NVYGameLibrary.ShipStatsTemplate memory)
    {
        return largeShipStatsTemplate;
    }

    function updateShipStatsStep(NVYGameLibrary.ShipStatsStep memory template)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        shipStatsStep = template;
    }

    function updateSmallShipTemplate(
        NVYGameLibrary.ShipStatsTemplate memory template
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        smallShipStatsTemplate = template;
    }

    function updateMiddleShipTemplate(
        NVYGameLibrary.ShipStatsTemplate memory template
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        middleShipStatsTemplate = template;
    }

    function updateLargeShipTemplate(
        NVYGameLibrary.ShipStatsTemplate memory template
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        largeShipStatsTemplate = template;
    }
}
