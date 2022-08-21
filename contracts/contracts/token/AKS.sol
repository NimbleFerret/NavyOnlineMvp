// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AKS is ERC20 {
    constructor() public ERC20("AKS", "AKS") {
        _mint(msg.sender, 1000 * 10**18);
    }

    function burn(address account, uint256 amount) external {
        _burn(account, amount);
    }
}
