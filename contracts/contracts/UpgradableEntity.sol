// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./island/IIsland.sol";
import "./token/IToken.sol";
import "./NVYGameLibrary.sol";

abstract contract UpgradableEntity is ERC721URIStorage, AccessControl {
    IToken public nvyToken;
    IToken public aksToken;

    // To keep track of token id's
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Navy.online admin wallet
    bytes32 public constant NVY_BACKEND = keccak256("NVY_BACKEND");

    // Keep track of every upgrade costs by level
    mapping(uint256 => NVYGameLibrary.UpgradeRequirementsByLevel)
        public levelToUpgrade;

    // Keep track of every entity level by it's id
    mapping(uint256 => uint256) public idToEntityLevel;

    // Upgrade event for Navy.online backend
    event UpgradeEntity(address owner, uint256 tokenId);

    function requireMinted(uint256 tokenId) external view {
        _requireMinted(tokenId);
    }

    function grantNFT(address player, string memory tokenURI)
        public
        onlyRole(NVY_BACKEND)
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        idToEntityLevel[newItemId] = 0;

        _mint(player, newItemId);

        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    // Entity upgrade

    function levelUpNFT(uint256 tokenId, string memory newMetadataURI)
        public
        onlyRole(NVY_BACKEND)
    {
        idToEntityLevel[tokenId] = idToEntityLevel[tokenId] + 1;
        _setTokenURI(tokenId, newMetadataURI);
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
