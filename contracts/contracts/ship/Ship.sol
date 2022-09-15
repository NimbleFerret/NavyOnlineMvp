// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../island/IIsland.sol";
import "../UpgradableEntity.sol";
import "../NVYGameLibrary.sol";

contract Ship is UpgradableEntity {
    IIsland private island;

    mapping(uint256 => NVYGameLibrary.ShipStats) public idToShips;

    constructor() public ERC721("SHIP", "NVYSHIP") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        levelToUpgrade[1] = NVYGameLibrary.UpgradeRequirementsByLevel(
            100,
            1,
            55
        );
        levelToUpgrade[2] = NVYGameLibrary.UpgradeRequirementsByLevel(
            100,
            1,
            55
        );
        levelToUpgrade[3] = NVYGameLibrary.UpgradeRequirementsByLevel(
            70,
            1,
            55
        );
        levelToUpgrade[4] = NVYGameLibrary.UpgradeRequirementsByLevel(
            51,
            1,
            55
        );
        levelToUpgrade[5] = NVYGameLibrary.UpgradeRequirementsByLevel(
            39,
            1,
            55
        );
        levelToUpgrade[6] = NVYGameLibrary.UpgradeRequirementsByLevel(
            28,
            2,
            55
        );
        levelToUpgrade[7] = NVYGameLibrary.UpgradeRequirementsByLevel(
            20,
            2,
            55
        );
        levelToUpgrade[8] = NVYGameLibrary.UpgradeRequirementsByLevel(
            14,
            3,
            55
        );
        levelToUpgrade[9] = NVYGameLibrary.UpgradeRequirementsByLevel(
            10,
            5,
            55
        );
        levelToUpgrade[10] = NVYGameLibrary.UpgradeRequirementsByLevel(
            5,
            8,
            55
        );
    }

    // Called by our backend app
    function grantShip(
        address player,
        NVYGameLibrary.ShipStats memory ship,
        string memory tokenURI
    ) external onlyRole(NVY_BACKEND) {
        uint256 tokenId = grantNFT(player, tokenURI);
        idToShips[tokenId] = ship;
    }

    function tryUpgrade(uint256 shipId, uint256 islandId) external {
        require(ERC721.ownerOf(shipId) == msg.sender, "Only owner can upgrade");
        island.requireMinted(islandId);

        uint256 nextLevel = idToEntityLevel[shipId] + 1;

        require(
            nextLevel <= NVYGameLibrary.shipAndCaptainMaxLevel,
            "Max level already reached"
        );

        NVYGameLibrary.UpgradeRequirementsByLevel memory req = levelToUpgrade[
            nextLevel
        ];

        uint256 reqNvy = req.nvy * 10**18;
        uint256 reqAks = req.aks * 10**18;

        require(nvyToken.balanceOf(msg.sender) >= reqNvy, "Not enought NVY");
        require(aksToken.balanceOf(msg.sender) >= reqAks, "Not enought AKS");

        // Pay the fees and burn tokens if not owner
        if (ERC721.ownerOf(shipId) != ERC721.ownerOf(islandId)) {
            uint256 feeNvy = (reqNvy / 100) *
                island.getIslandInfo(islandId).shipAndCaptainFee;
            uint256 feeAks = (reqAks / 100) *
                island.getIslandInfo(islandId).shipAndCaptainFee;

            nvyToken.burn(reqNvy - feeNvy);
            aksToken.burn(reqAks - feeAks);

            nvyToken.transfer(ERC721.ownerOf(islandId), feeNvy);
            aksToken.transfer(ERC721.ownerOf(islandId), feeAks);
        } else {
            nvyToken.burn(reqNvy / 2);
            aksToken.burn(reqAks / 2);
        }

        emit UpgradeEntity(msg.sender, shipId);
    }

    // ---------------------------------------
    // Admin functions
    // ---------------------------------------

    function setIslandContractAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        island = IIsland(addr);
    }
}
