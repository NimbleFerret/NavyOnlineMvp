// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NVY is ERC20, AccessControl {
    // For island mining
    bytes32 public constant ISLAND_ROLE = keccak256("ISLAND_ROLE");
    bytes32 public constant CAPTAIN_ROLE = keccak256("CAPTAIN_ROLE");

    // 36% of total emission
    uint256 public miningAndStakingAmountLeft = 144 * 10**18;

    event RewardGranted(address recipient, uint256 reward);

    constructor() public ERC20("Navy", "NVY") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _mint(msg.sender, 2000 * 10**18);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function mintReward(address recipient, uint256 amount)
        external
        onlyRole(ISLAND_ROLE)
        onlyRole(CAPTAIN_ROLE)
    {
        uint256 reward = amount * 10**18;
        require(
            miningAndStakingAmountLeft > 0,
            "No more tokens for any rewards"
        );
        if (miningAndStakingAmountLeft - reward < 0) {
            reward = reward - (miningAndStakingAmountLeft - reward);
            miningAndStakingAmountLeft = 0;
        } else {
            miningAndStakingAmountLeft -= reward;
        }
        _mint(recipient, reward);
        emit RewardGranted(recipient, reward);
    }

    // ---------------------------------------
    // Admin functions
    // ---------------------------------------

    function addIslandAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(!hasRole(ISLAND_ROLE, addr), "Island address already added.");
        _grantRole(ISLAND_ROLE, addr);
    }

    function removeIslandAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            !hasRole(ISLAND_ROLE, addr),
            "Address is not a recognized Island."
        );
        _revokeRole(ISLAND_ROLE, addr);
    }

    function addCaptainAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(!hasRole(ISLAND_ROLE, addr), "Captain address already added.");
        _grantRole(CAPTAIN_ROLE, addr);
    }

    function removeCaptainAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            !hasRole(CAPTAIN_ROLE, addr),
            "Address is not a recognized Captain."
        );
        _revokeRole(CAPTAIN_ROLE, addr);
    }
}
