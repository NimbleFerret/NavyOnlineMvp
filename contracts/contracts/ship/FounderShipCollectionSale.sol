// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FounderShipCollectionSale is Ownable {
    uint256 public shipOnSaleTotal;
    uint256 public shipPrice;

    event GenerateShip(address owner);

    constructor(uint256 _shipOnSaleTotal, uint256 _shipPrice) public {
        shipOnSaleTotal = _shipOnSaleTotal;
        shipPrice = _shipPrice * 10**18;
    }

    function buyShip() public payable {
        require(shipOnSaleTotal > 0, "No more ships to sell");
        require(address(msg.sender).balance >= shipPrice, "Insufficient funds");

        shipOnSaleTotal -= 1;

        // Notify our backend to generate a new random ship and give it to the user
        emit GenerateShip(msg.sender);
    }

    function getShipsOnSale() public view returns (uint256) {
        return shipOnSaleTotal;
    }

    function getShipPrice() public view returns (uint256) {
        return shipPrice;
    }
}
