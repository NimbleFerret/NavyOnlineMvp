// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../island/IIsland.sol";
import "../token/IToken.sol";
import "../NVYGameLibrary.sol";

contract Ship is ERC721URIStorage, AccessControl {
    IToken private nvyToken;
    IToken private aksToken;
    IIsland private island;

    mapping(uint256 => NVYGameLibrary.ShipStats) public idToShips;

    event UpgradeShip(address player, uint256 shipId);

    // Ship could be created only by NVY Backend after buying
    bytes32 public constant NVY_BACKEND = keccak256("NVY_BACKEND");

    // To keep track of ship id's
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Keep track of every upgrade costs by level
    mapping(uint256 => NVYGameLibrary.UpgradeRequirementsByLevel)
        public levelToUpgrade;

    constructor() public ERC721("SHIP", "NVYSHP") {
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
    function grantNFT(
        address player,
        NVYGameLibrary.ShipStats memory ship,
        string memory tokenURI
    ) external onlyRole(NVY_BACKEND) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        idToShips[newItemId] = ship;

        _mint(player, newItemId);

        _setTokenURI(newItemId, tokenURI);
    }

    function upgradeShip(uint256 shipId, NVYGameLibrary.ShipStats memory ship)
        external
        onlyRole(NVY_BACKEND)
    {
        idToShips[shipId] = ship;
    }

    function tryUpgrade(uint256 shipId, uint256 islandId) external {
        require(ERC721.ownerOf(shipId) == msg.sender, "Only owner can upgrade");
        require(
            island.getIslandInfo(islandId).fees != 0,
            "Unable to find an island"
        );

        NVYGameLibrary.ShipStats memory ship = idToShips[shipId];

        require(
            ship.level + 1 <= NVYGameLibrary.shipAndCaptainMaxLevel,
            "Max level already reached"
        );

        // NVYGameLibrary.UpgradeRequirementsByLevel memory req = levelToUpgrade[
        //     ship.level + 1
        // ];

        uint256 reqNvy = 1 * 10**18;
        uint256 reqAks = 1 * 10**18;

        // uint256 reqNvy = req.nvy * 10**18;
        // uint256 reqAks = req.aks * 10**18;

        require(nvyToken.balanceOf(msg.sender) >= reqNvy, "Not enought NVY");
        require(aksToken.balanceOf(msg.sender) >= reqAks, "Not enought AKS");

        // Pay the fees and burn tokens

        uint256 feeNvy = (reqNvy / 100) * island.getIslandInfo(islandId).fees;
        uint256 feeAks = (reqAks / 100) * island.getIslandInfo(islandId).fees;

        nvyToken.burn(reqNvy - feeNvy);
        aksToken.burn(reqAks - feeAks);

        nvyToken.transfer(ERC721.ownerOf(islandId), feeNvy);
        aksToken.transfer(ERC721.ownerOf(islandId), feeAks);

        emit UpgradeShip(msg.sender, shipId);
    }

    function getCurrentShipIndex() public view returns (uint256) {
        return _tokenIds.current();
    }

    function getShipInfoById(uint256 id)
        public
        view
        returns (NVYGameLibrary.ShipStats memory)
    {
        return idToShips[id];
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

    function setIslandContractAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        island = IIsland(addr);
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
