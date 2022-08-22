// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./IShipGenerator.sol";
import "./IShipyard.sol";
import "../NVYGameLibrary.sol";

contract Ship is ERC721, AccessControl {
    IShipGenerator private shipGenerator;
    IShipyard private shipyard;

    mapping(uint256 => NVYGameLibrary.ShipStats) public idToShips;

    function setShipGeneratorContractAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        shipGenerator = IShipGenerator(addr);
    }

    function setShipyardContractAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        shipyard = IShipyard(addr);
    }

    // Ship could be created only by ship sale contract after buying
    bytes32 public constant SALE_ROLE = keccak256("SALE_ROLE");

    // To keep track of ship id's
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() public ERC721("SHIP", "NVYSHP") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // TODO double check ship generator address
    function grantNFT(address player)
        external
        onlyRole(SALE_ROLE)
        returns (bool)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        idToShips[newItemId] = shipGenerator.generateNewRandomShip();

        _mint(player, newItemId);
        // WTF token uri is ?
        // tokenURI(newItemId);

        return true;
    }

    // Damage

    // Repair

    // Upgrade

    // TODO use msg.sender
    function upgrade(address account, uint256 shipId) external {
        require(ERC721.ownerOf(shipId) == account, "Only owner can upgrade");

        NVYGameLibrary.ShipStats memory ship = idToShips[shipId];

        require(
            ship.level + 1 <= NVYGameLibrary.maxShipLevel,
            "Max level already reached"
        );
        require(shipyard.upgradeShip(account, ship.level), "Upgrade failed");

        // TODO give trait and stats
        ship.level += 1;
        idToShips[shipId] = ship;
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

    function addSaleContract(address provider)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(!hasRole(SALE_ROLE, provider), "Provider already added.");
        _grantRole(SALE_ROLE, provider);
    }

    function removeSaleContract(address provider)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            !hasRole(SALE_ROLE, provider),
            "Address is not a recognized provider."
        );
        _revokeRole(SALE_ROLE, provider);
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
