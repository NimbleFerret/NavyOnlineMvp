// const NVYShip = artifacts.require("./NVYShip.sol");
// const ShipCollectionSale = artifacts.require("./ShipCollectionSale.sol");
// const ShipGenerator = artifacts.require("./ShipGenerator.sol");
// const ShipTemplate = artifacts.require("./ShipTemplate.sol");

// // const Game = artifacts.require("./Game.sol");

// contract("ShipGenerator", accounts => {
//   it("...Should generate different ships within given params", async () => {
//     const NVYShipInstance = await NVYShip.deployed();
//     const ShipCollectionSaleInstance = await ShipCollectionSale.deployed();
//     const ShipGeneratorInstance = await ShipGenerator.deployed();
//     const ShipTemplateInstance = await ShipTemplate.deployed();

//     // Set all necessary addresses 
//     await NVYShipInstance.addSaleContract(ShipCollectionSaleInstance.address);
//     await ShipCollectionSaleInstance.setShipContractAddress(NVYShipInstance.address);
//     await ShipGeneratorInstance.updateSmallShipContractAddress(ShipTemplateInstance.address);

//     await NVYShipInstance.setShipGeneratorContractAddress(ShipGeneratorInstance.address);

//     let currentShipIndex = await NVYShipInstance.getCurrentShipIndex();
//     let shipsOnSale = await ShipCollectionSaleInstance.getShipsOnSale();
//     const shipPrice = await ShipCollectionSaleInstance.getShipPrice();

//     console.log('Ship index:' + currentShipIndex);
//     console.log('Ships on sale: ' + shipsOnSale);
//     console.log('shipPrice: ' + shipPrice);

//     // TODO make sure that balances changed before and after nft buying

//     await ShipCollectionSaleInstance.buyShip(1000, {from: accounts[1], value: 1000});

//     currentShipIndex = await NVYShipInstance.getCurrentShipIndex();
//     shipsOnSale = await ShipCollectionSaleInstance.getShipsOnSale();

//     console.log('Ship index:' + currentShipIndex);
//     console.log('Ships on sale: ' + shipsOnSale);

//     const ship = await NVYShipInstance.getShipInfoById(currentShipIndex);

//     console.log('ship:');
//     console.log(ship)

//     // TODO test 

//     // console.log('ship2:');
//     // console.log(ship2);

//     // let nonce = 0;
//     // console.log(await NVYShipInstance.random(1, 7, ++nonce));
//     // console.log(await NVYShipInstance.random(1, 7, ++nonce));
//     // console.log(await NVYShipInstance.random(1, 7, ++nonce));
//     // console.log(await NVYShipInstance.random(1, 7, ++nonce));
//     // console.log(await NVYShipInstance.random(1, 7, ++nonce));
//     // console.log(await NVYShipInstance.random(1, 7, ++nonce));
//     // console.log(await NVYShipInstance.random(1, 7, ++nonce));
//     // console.log(await NVYShipInstance.random(1, 7, ++nonce));
//     // console.log(await NVYShipInstance.random(1, 7, ++nonce));
//     // console.log(await NVYShipInstance.random(1, 7, ++nonce));

 

//     // const account2InitialBalance =  await web3.eth.getBalance(accounts[1]);
//     // console.log('Initial account2 balance: ' + account2InitialBalance);


//     // console.log(await ShipCollectionSaleInstance.getShipsOnSale());
//     // console.log(await ShipCollectionSaleInstance.getShipPrice());

//     // await ShipCollectionSaleInstance.buyShip(1, {from: accounts[1], value: 1});

//     // const account2PostBuyBalance =  await web3.eth.getBalance(accounts[1]);
//     // console.log('Post buy account2 balance: ' + account2PostBuyBalance);

//     // const shipObject = await NVYShipInstance.getShipInfoById(1);
//     // console.log('shipObject: ' + shipObject);
//     // console.log('NVYShipInstance address: ' + NVYShipInstance.address);

//     // TODO add balance change check
//     // assert.equal(balance, 160000018, "Wrong NVY initial value");
//   });
// });
