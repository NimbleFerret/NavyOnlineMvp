// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../NVYGameLibrary.sol";

interface IIsland {
    function requireMinted(uint256 islandId) external view;

    function getIslandInfo(uint256 islandId)
        external
        view
        returns (NVYGameLibrary.IslandStats memory);

    function addMiner(uint256 islandId) external;

    function removeMiner(uint256 islandId) external;
}
