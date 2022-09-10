// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NVY is ERC20 {
    constructor() public ERC20("Navy", "NVY") {
        _mint(msg.sender, 2000 * 10**18);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
