// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../island/IIsland.sol";
import "../UpgradableEntity.sol";

contract Captain is UpgradableEntity {
    IIsland private island;

    mapping(uint256 => NVYGameLibrary.CaptainStats) public idToCaptains;

    constructor() public ERC721("CAPT", "NVYCAPT") {
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
            2,
            55
        );
        levelToUpgrade[4] = NVYGameLibrary.UpgradeRequirementsByLevel(
            51,
            2,
            55
        );
        levelToUpgrade[5] = NVYGameLibrary.UpgradeRequirementsByLevel(
            39,
            3,
            55
        );
        levelToUpgrade[6] = NVYGameLibrary.UpgradeRequirementsByLevel(
            28,
            3,
            55
        );
        levelToUpgrade[7] = NVYGameLibrary.UpgradeRequirementsByLevel(
            20,
            5,
            55
        );
        levelToUpgrade[8] = NVYGameLibrary.UpgradeRequirementsByLevel(
            14,
            8,
            55
        );
        levelToUpgrade[9] = NVYGameLibrary.UpgradeRequirementsByLevel(
            10,
            13,
            55
        );
        levelToUpgrade[10] = NVYGameLibrary.UpgradeRequirementsByLevel(
            5,
            21,
            55
        );
    }

    function grantCaptain(
        address player,
        NVYGameLibrary.CaptainStats memory captain,
        string memory tokenURI
    ) external onlyRole(NVY_BACKEND) {
        uint256 tokenId = grantNFT(player, tokenURI);
        idToCaptains[tokenId] = captain;
    }

    function tryUpgrade(uint256 captainId, uint256 islandId) external {
        require(
            ERC721.ownerOf(captainId) == msg.sender,
            "Only owner can upgrade"
        );
        island.requireMinted(islandId);

        uint256 nextLevel = idToEntityLevel[captainId] + 1;

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
        if (ERC721.ownerOf(captainId) != ERC721.ownerOf(islandId)) {
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

        emit UpgradeEntity(msg.sender, captainId);
    }

    // ---------------------------------------
    // Staking and mining
    // ---------------------------------------

    function startStaking(uint256 captainId) external {
        require(
            ERC721.ownerOf(captainId) == msg.sender,
            "Only owner can stake"
        );
        NVYGameLibrary.CaptainStats memory captain = idToCaptains[captainId];
        require(!captain.staking, "Staking already started");
        require(!captain.mining, "Unable to stake while mining");

        captain.miningStartedAt = block.timestamp;
        captain.staking = true;
    }

    function collectStakingRewards(uint256 captainId) external {
        require(
            ERC721.ownerOf(captainId) == msg.sender,
            "Only owner can collect rewards"
        );
        NVYGameLibrary.CaptainStats memory captain = idToCaptains[captainId];
        require(captain.staking, "Staking must be started first");
        require(
            captain.miningStartedAt + captain.miningDurationSeconds <
                block.timestamp,
            "Staking is not finished yet"
        );

        captain.miningStartedAt = 0;
        captain.staking = false;

        nvyToken.mintReward(msg.sender, captain.stakingRewardNVY);
    }

    function startMining(uint256 captainId, uint256 islandId) external {
        require(
            ERC721.ownerOf(captainId) == msg.sender,
            "Only owner can stake"
        );
        island.requireMinted(islandId);

        NVYGameLibrary.CaptainStats memory captain = idToCaptains[captainId];
        NVYGameLibrary.IslandStats memory islandStats = island.getIslandInfo(
            islandId
        );
        require(!captain.staking, "Unable to mine while staking");
        require(!captain.mining, "Mining already started");
        require(
            islandStats.currMiners + 1 < islandStats.maxMiners,
            "Mine is full"
        );
        require(
            ERC721.ownerOf(captainId) != ERC721.ownerOf(islandId),
            "Can't mine on own island"
        );

        island.addMiner(islandId);

        captain.miningStartedAt = block.timestamp;
        captain.mining = true;
        captain.miningIsland = islandId;

        idToCaptains[captainId] = captain;
    }

    function collectMiningRewards(uint256 captainId) external {
        require(
            ERC721.ownerOf(captainId) == msg.sender,
            "Only owner can collect rewards"
        );
        NVYGameLibrary.CaptainStats memory captain = idToCaptains[captainId];
        require(captain.mining, "Mining must be started first");
        require(
            captain.miningStartedAt + captain.miningDurationSeconds <
                block.timestamp,
            "Mining is not finished yet"
        );

        // Grant reward to the captain owner
        uint256 islandFee = (captain.miningRewardNVY / 100) *
            island.getIslandInfo(captain.miningIsland).minersFee;
        nvyToken.mintReward(msg.sender, captain.miningRewardNVY - islandFee);

        // Grant reward to the island owner
        nvyToken.mintReward(ERC721.ownerOf(captain.miningIsland), islandFee);

        // Reset
        island.removeMiner(captain.miningIsland);

        captain.miningStartedAt = 0;
        captain.mining = false;
        captain.miningIsland = 0;

        idToCaptains[captainId] = captain;
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
