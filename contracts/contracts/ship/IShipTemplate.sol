// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../NVYGameLibrary.sol";

interface IShipTemplate {
    function getShipStats()
        external
        view
        returns (NVYGameLibrary.ShipStatsTemplate memory);
}
