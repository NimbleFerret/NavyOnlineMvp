// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FounderIslandCollectionSale is Ownable {
    uint256 public islandOnSaleTotal;
    uint256 public islandPrice;

    event GenerateIsland(address owner);

    constructor(uint256 _islandOnSaleTotal, uint256 _islandPrice) public {
        islandOnSaleTotal = _islandOnSaleTotal;
        islandPrice = _islandPrice * 10**18;
    }

    function buyIsland() public payable {
        require(islandOnSaleTotal > 0, "No more islands to sell");
        require(
            address(msg.sender).balance >= islandPrice,
            "Insufficient funds"
        );

        islandOnSaleTotal -= 1;

        // Notify our backend to generate a new random ship and give it to the user
        emit GenerateIsland(msg.sender);
    }
}
