// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FounderCaptainCollectionSale is Ownable {
    uint256 public captainOnSaleTotal;
    uint256 public captainPrice;

    event GenerateCaptain(address owner);

    constructor(uint256 _captainOnSaleTotal, uint256 _captainPrice) public {
        captainOnSaleTotal = _captainOnSaleTotal;
        captainPrice = _captainPrice * 10 ** 18;
    }

    function buyCaptain() public payable {
        require(captainOnSaleTotal > 0, "No more captains to sell");
        require(
            address(msg.sender).balance >= captainPrice,
            "Insufficient funds"
        );

        captainOnSaleTotal -= 1;

        emit GenerateCaptain(msg.sender);
    }
}
