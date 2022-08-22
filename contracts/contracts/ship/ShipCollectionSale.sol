// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../IGrantNFT.sol";

contract ShipCollectionSale is Ownable {
    IGrantNFT private shipContract;

    uint256 shipOnSaleTotal;
    uint256 shipPrice;

    constructor(uint256 _shipOnSaleTotal, uint256 _shipPrice) public {
        shipOnSaleTotal = _shipOnSaleTotal;
        shipPrice = _shipPrice * 10**18;
    }

    function setShipContractAddress(address _shipContractAddress)
        external
        onlyOwner
    {
        shipContract = IGrantNFT(_shipContractAddress);
    }

    function buyShip(uint256 amount) public payable {
        require(shipOnSaleTotal > 0, "No more ships to sell");
        require(address(msg.sender).balance >= shipPrice, "Insufficient funds");
        require(msg.value == amount && msg.value == shipPrice, "Bad amount");
        require(shipContract.grantNFT(msg.sender), "Error during ship minting");
        shipOnSaleTotal -= 1;
    }

    function getShipsOnSale() public view returns (uint256) {
        return shipOnSaleTotal;
    }

    function getShipPrice() public view returns (uint256) {
        return shipPrice;
    }
}
