// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../NVYGameLibrary.sol";
import "../token/IToken.sol";

contract Island is ERC721, AccessControl {
    IToken private nvyToken;

    mapping(uint256 => NVYGameLibrary.IslandStats) public idToIslands;

    // Island could be created only by island sale contract after buying
    bytes32 public constant SALE_ROLE = keccak256("SALE_ROLE");

    // To keep track of ship id's
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() public ERC721("ISLAND", "NVYISL") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function grantNFT(address player)
        external
        onlyRole(SALE_ROLE)
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        idToIslands[newItemId] = NVYGameLibrary.IslandStats(
            1, // 1 NVY reward
            10,
            0,
            1
        );

        _mint(player, newItemId);
        // WTF token uri is ?
        // tokenURI(newItemId);

        return newItemId;
    }

    // TODO reward
    // TODO use msg.sender
    function collectReward(address account, uint256 islandId) external {
        require(
            ERC721.ownerOf(islandId) == account,
            "Only owner can mine new tokens"
        );
        // TODO check time stuff
        nvyToken.mintIslandReward(account, idToIslands[islandId].reward);
    }

    function getIslandInfo(uint256 islandId)
        external
        view
        returns (NVYGameLibrary.IslandStats memory)
    {
        return idToIslands[islandId];
    }

    // ---------------------------------------
    // Admin functions
    // ---------------------------------------

    function addSaleContract(address provider)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(!hasRole(SALE_ROLE, provider), "Sale contract already added.");
        _grantRole(SALE_ROLE, provider);
    }

    function addNvyContractAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        nvyToken = IToken(addr);
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
