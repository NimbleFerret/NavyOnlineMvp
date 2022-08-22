// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../IGrantNFT.sol";

// TODO inherit all sale contracts ?
contract IslandCollectionSale is Ownable {
    IGrantNFT private islandContract;

    uint256 islandOnSaleTotal;
    uint256 islandPrice;

    constructor(uint256 _islandOnSaleTotal, uint256 _islandPrice) public {
        islandOnSaleTotal = _islandOnSaleTotal;
        islandPrice = _islandPrice * 10**18;
    }

    function setIslandContractAddress(address addr) external onlyOwner {
        islandContract = IGrantNFT(addr);
    }

    function buyIsland(uint256 amount) public payable {
        require(islandOnSaleTotal > 0, "No more islands to sell");
        require(
            address(msg.sender).balance >= islandPrice,
            "Insufficient funds"
        );
        require(msg.value == amount && msg.value == islandPrice, "Bad amount");
        require(
            islandContract.grantNFT(msg.sender),
            "Error during island minting"
        );
        islandOnSaleTotal -= 1;
    }
}
