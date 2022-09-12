// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AKS is ERC20, AccessControl {
    // Navy.online admin wallet
    bytes32 public constant NVY_BACKEND = keccak256("NVY_BACKEND");

    event RewardGranted(address recipient, uint256 reward);

    // Remove initial supply in future
    constructor() public ERC20("AKS", "AKS") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _mint(msg.sender, 4000 * 10**18);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function mintReward(address recipient, uint256 amount)
        external
        onlyRole(NVY_BACKEND)
    {
        uint256 reward = amount * 10**18;
        _mint(recipient, reward);
        emit RewardGranted(recipient, reward);
    }

    // ---------------------------------------
    // Admin functions
    // ---------------------------------------

    function addNvyBackendAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            !hasRole(NVY_BACKEND, addr),
            "Nvy backend address already added."
        );
        _grantRole(NVY_BACKEND, addr);
    }

    function removeNvyBackendAddr(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            !hasRole(NVY_BACKEND, addr),
            "Address is not a recognized NVY backend."
        );
        _revokeRole(NVY_BACKEND, addr);
    }
}
