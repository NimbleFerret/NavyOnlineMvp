// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NVY is ERC20, AccessControl {
    // For island mining
    bytes32 public constant NVY_BACKEND_ROLE = keccak256("NVY_BACKEND_ROLE");
    bytes32 public constant ISLAND_ROLE = keccak256("ISLAND_ROLE");
    bytes32 public constant CAPTAIN_ROLE = keccak256("CAPTAIN_ROLE");

    // 400.000.000 NVY total
    // 20% of total emission
    uint256 public ingameRewardsAmountLeft = 80 * 10**18;
    // 36% of total emission
    uint256 public miningAndStakingAmountLeft = 144 * 10**18;
    // 44% of rest emission
    uint256 public restEmissionAmountLeft = 176 * 10**18;

    event IngameRewardGranted(address recipient, uint256 reward);
    event MiningRewardGranted(address recipient, uint256 reward);
    event TokensMinted(address recipient, uint256 reward);

    constructor() public ERC20("Navy", "NVY") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function mintTOkens(address recipient, uint256 amount)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        uint256 mintAmount = amount * 10**18;
        require(restEmissionAmountLeft > 0, "No more tokens for minting");
        if (restEmissionAmountLeft - mintAmount < 0) {
            mintAmount = mintAmount - (restEmissionAmountLeft - mintAmount);
            restEmissionAmountLeft = 0;
        } else {
            restEmissionAmountLeft -= mintAmount;
        }
        _mint(recipient, mintAmount);
        emit TokensMinted(recipient, mintAmount);
    }

    function mintRewardIngame(address recipient, uint256 amount)
        external
        onlyRole(NVY_BACKEND_ROLE)
    {
        uint256 reward = amount * 10**18;
        require(ingameRewardsAmountLeft > 0, "No more tokens for any rewards");
        if (ingameRewardsAmountLeft - reward < 0) {
            reward = reward - (ingameRewardsAmountLeft - reward);
            ingameRewardsAmountLeft = 0;
        } else {
            ingameRewardsAmountLeft -= reward;
        }
        _mint(recipient, reward);
        emit IngameRewardGranted(recipient, reward);
    }

    function mintIslandRewardByIsland(address recipient, uint256 amount)
        external
        onlyRole(ISLAND_ROLE)
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
        emit MiningRewardGranted(recipient, reward);
    }

    function mintIslandRewardByCaptain(address recipient, uint256 amount)
        external
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
        emit MiningRewardGranted(recipient, reward);
    }

    // ---------------------------------------
    // Admin functions
    // ---------------------------------------

    function addBackendAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            !hasRole(NVY_BACKEND_ROLE, addr),
            "Backend address already added."
        );
        _grantRole(NVY_BACKEND_ROLE, addr);
    }

    function removeBackendAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            !hasRole(NVY_BACKEND_ROLE, addr),
            "Address is not a recognized Backend."
        );
        _revokeRole(NVY_BACKEND_ROLE, addr);
    }

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
