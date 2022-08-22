// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "../NVYGameLibrary.sol";

contract ShipTemplate is AccessControl {
    NVYGameLibrary.ShipStatsTemplate shipStatsTemplate;

    constructor() public {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        // Default data
        shipStatsTemplate = NVYGameLibrary.ShipStatsTemplate(
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
            1, // minCannonsOnSide
            3, // maxCannonsOnSide
            600, // minCannonsRange
            1000, // maxCannonsRange
            20, // minCannonballDamage
            50 // maxCannonballDamage
        );
    }

    function getShipStats()
        external
        view
        returns (NVYGameLibrary.ShipStatsTemplate memory)
    {
        return shipStatsTemplate;
    }

    function updateShipTemplate(
        NVYGameLibrary.ShipStatsTemplate memory template
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        shipStatsTemplate = template;
    }
}
