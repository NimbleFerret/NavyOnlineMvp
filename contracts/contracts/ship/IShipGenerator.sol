// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../NVYGameLibrary.sol";

interface IShipGenerator {
    function generateNewRandomShip()
        external
        returns (NVYGameLibrary.ShipStats memory);
}
