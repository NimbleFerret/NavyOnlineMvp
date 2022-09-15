// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IToken {
    function burn(uint256 amount) external;

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function mintRewardIngame(address recipient, uint256 amount) external;

    function mintIslandRewardByIsland(address recipient, uint256 amount)
        external;

    function mintIslandRewardByCaptain(address recipient, uint256 amount)
        external;
}
