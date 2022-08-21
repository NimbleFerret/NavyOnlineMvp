// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NVY is ERC20, AccessControl {
    constructor() public ERC20("Navy", "NVY") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _mint(msg.sender, 1000 * 10**18);
    }

    // TODO protect burning tokens ?
    function burn(address account, uint256 amount) external {
        _burn(account, amount);
    }
}
