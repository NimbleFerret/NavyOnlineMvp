// const Ship = artifacts.require("./Ship.sol");
// const ShipCollectionSale = artifacts.require("./ShipCollectionSale.sol");
// const ShipGenerator = artifacts.require("./ShipGenerator.sol");
// const ShipTemplate = artifacts.require("./ShipTemplate.sol");

// contract("ShipGenerator", accounts => {
//   it("...Should generate different ships within given params", async () => {
//     const ShipInstance = await Ship.deployed();
//     const ShipCollectionSaleInstance = await ShipCollectionSale.deployed();
//     const ShipGeneratorInstance = await ShipGenerator.deployed();
//     const ShipTemplateInstance = await ShipTemplate.deployed();

//     // Set all necessary addresses 
//     await ShipInstance.addSaleContract(ShipCollectionSaleInstance.address);
//     await ShipCollectionSaleInstance.setShipContractAddress(ShipInstance.address);
//     await ShipGeneratorInstance.updateSmallShipContractAddress(ShipTemplateInstance.address);
//     await ShipInstance.setShipGeneratorContractAddress(ShipGeneratorInstance.address);

//     let shipsOnSale = await ShipCollectionSaleInstance.getShipsOnSale();
//     const shipPrice = await ShipCollectionSaleInstance.getShipPrice();

//     console.log('Ships on sale: ' + shipsOnSale);
//     console.log('Ship price: ' + shipPrice);

//     const amount = web3.utils.toWei('10', 'ether');
//     console.log(amount);

//     const ethBalanceBeforeBuying = await web3.eth.getBalance(accounts[1]);
//     await ShipCollectionSaleInstance.buyShip(amount, { from: accounts[1], value: amount });
//     const ethBalanceAfterBuying = await web3.eth.getBalance(accounts[1]);

//     console.log('ethBalanceBeforeBuying:' + ethBalanceBeforeBuying);
//     console.log('ethBalanceAfterBuying: ' + ethBalanceAfterBuying);

//     const currentShipIndex = await ShipInstance.getCurrentShipIndex();
//     shipsOnSale = await ShipCollectionSaleInstance.getShipsOnSale();

//     console.log('Ship index:' + currentShipIndex);
//     console.log('Ships on sale: ' + shipsOnSale);

//     const ship = await ShipInstance.getShipInfoById(currentShipIndex);

//     console.log('ship:');
//     console.log(ship)

//     // TODO somehow get all ships of account[1]

//     // TODO test ship stats
//   });
// });
