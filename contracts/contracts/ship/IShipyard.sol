// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IShipyard {
    function upgradeShip(address account, uint256 currentShipLevel)
        external
        returns (bool);
}
