// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../NVYGameLibrary.sol";
import "../token/IToken.sol";

contract Island is ERC721URIStorage, AccessControl {
    IToken private nvyToken;
    IToken private aksToken;

    mapping(uint256 => NVYGameLibrary.IslandStats) public idToIslands;

    event UpgradeIsland(address player, uint256 islandId);

    // Ship could be created only by NVY Backend after buying
    bytes32 public constant NVY_BACKEND = keccak256("NVY_BACKEND");

    // To keep track of island id's
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Keep track of every upgrade costs by level
    mapping(uint256 => NVYGameLibrary.UpgradeRequirementsByLevel)
        public levelToUpgrade;

    constructor() public ERC721("ISLAND", "NVYISL") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        levelToUpgrade[1] = NVYGameLibrary.UpgradeRequirementsByLevel(
            100,
            1150,
            10120
        );
        levelToUpgrade[2] = NVYGameLibrary.UpgradeRequirementsByLevel(
            100,
            1150,
            10120
        );
        levelToUpgrade[3] = NVYGameLibrary.UpgradeRequirementsByLevel(
            100,
            1150,
            10120
        );
    }

    function grantNFT(
        address player,
        NVYGameLibrary.IslandStats memory island,
        string memory tokenURI
    ) external onlyRole(NVY_BACKEND) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        idToIslands[newItemId] = island;

        _mint(player, newItemId);

        _setTokenURI(newItemId, tokenURI);
    }

    function upgradeIsland(
        uint256 islandId,
        NVYGameLibrary.IslandStats memory island
    ) external onlyRole(NVY_BACKEND) {
        idToIslands[islandId] = island;
    }

    function tryUpgrade(uint256 islandId) external {
        require(
            ERC721.ownerOf(islandId) == msg.sender,
            "Only owner can upgrade"
        );

        NVYGameLibrary.IslandStats memory island = idToIslands[islandId];

        require(
            island.level + 1 <= NVYGameLibrary.islandMaxLevel,
            "Max level already reached"
        );

        NVYGameLibrary.UpgradeRequirementsByLevel memory req = levelToUpgrade[
            island.level + 1
        ];

        uint256 reqNvy = req.nvy * 10**18;
        uint256 reqAks = req.aks * 10**18;

        require(nvyToken.balanceOf(msg.sender) >= reqNvy, "Not enought NVY");
        require(aksToken.balanceOf(msg.sender) >= reqAks, "Not enought AKS");

        nvyToken.burn(reqNvy);
        aksToken.burn(reqAks);

        emit UpgradeIsland(msg.sender, islandId);
    }

    function getIslandInfo(uint256 islandId)
        external
        view
        returns (NVYGameLibrary.IslandStats memory)
    {
        return idToIslands[islandId];
    }

    function getCurrentIslandIndex() public view returns (uint256) {
        return _tokenIds.current();
    }

    // ---------------------------------------
    // Admin functions
    // ---------------------------------------

    function addNvyBackendAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            !hasRole(NVY_BACKEND, addr),
            "Nvy backend address already added."
        );
        _grantRole(NVY_BACKEND, addr);
    }

    function removeNvyBackendAddr(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            !hasRole(NVY_BACKEND, addr),
            "Address is not a recognized NVY backend."
        );
        _revokeRole(NVY_BACKEND, addr);
    }

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

    function updateUpgradeRequirements(
        uint256 level,
        uint256 chance,
        uint256 nvy,
        uint256 aks
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        levelToUpgrade[level] = NVYGameLibrary.UpgradeRequirementsByLevel(
            chance,
            nvy,
            aks
        );
    }

    // ---------------------------------------
    // Misc
    // ---------------------------------------

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
