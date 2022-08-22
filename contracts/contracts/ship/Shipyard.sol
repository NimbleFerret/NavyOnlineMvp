// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "../NVYGameLibrary.sol";
import "../token/IToken.sol";

contract Shipyard is AccessControl {
    IToken private nvyToken;
    IToken private aksToken;

    struct UpgradeRequirementsByLevel {
        uint256 chance;
        uint256 nvy;
        uint256 aks;
    }
    mapping(uint256 => UpgradeRequirementsByLevel) public levelToUpgrade;

    uint256 maxShipLevel;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        levelToUpgrade[1] = UpgradeRequirementsByLevel(100, 1, 55);
        levelToUpgrade[2] = UpgradeRequirementsByLevel(88, 1, 55);
        levelToUpgrade[3] = UpgradeRequirementsByLevel(70, 2, 55);
        levelToUpgrade[4] = UpgradeRequirementsByLevel(51, 2, 55);
        levelToUpgrade[5] = UpgradeRequirementsByLevel(39, 3, 55);
        levelToUpgrade[6] = UpgradeRequirementsByLevel(28, 3, 55);
        levelToUpgrade[7] = UpgradeRequirementsByLevel(20, 5, 55);
        levelToUpgrade[8] = UpgradeRequirementsByLevel(14, 8, 55);
        levelToUpgrade[9] = UpgradeRequirementsByLevel(10, 13, 55);
        levelToUpgrade[10] = UpgradeRequirementsByLevel(5, 21, 55);

        maxShipLevel = 10;
    }

    function upgradeShip(address account, uint256 currentShipLevel)
        external
        returns (bool)
    {
        UpgradeRequirementsByLevel memory req = levelToUpgrade[
            currentShipLevel + 1
        ];
        uint256 reqNvy = req.nvy * 10**18;
        uint256 reqAks = req.aks * 10**18;

        require(nvyToken.balanceOf(account) >= reqNvy, "Not enought NVY");
        require(aksToken.balanceOf(account) >= reqAks, "Not enought AKS");

        nvyToken.burn(account, reqNvy);
        aksToken.burn(account, reqAks);

        return random(0, 100) < req.chance;
    }

    // ---------------------------------------
    // Admin functions
    // ---------------------------------------

    function setNvyContract(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        nvyToken = IToken(addr);
    }

    function setAksContract(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        aksToken = IToken(addr);
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
