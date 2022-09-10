// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../NVYGameLibrary.sol";

interface IIsland {
    function getIslandInfo(uint256 islandId)
        external
        returns (NVYGameLibrary.IslandStats memory);
}
