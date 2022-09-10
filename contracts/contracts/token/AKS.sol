// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AKS is ERC20 {
    // Remove initial supply in future
    constructor() public ERC20("AKS", "AKS") {
        _mint(msg.sender, 4000 * 10**18);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
