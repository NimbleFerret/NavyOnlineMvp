// const NVYToken = artifacts.require("./NVYToken.sol");
// const Island = artifacts.require("./Island.sol");
// const IslandCollectionSale = artifacts.require("./IslandCollectionSale.sol");

// contract("Island", accounts => {
//   it("...Should be able to mint and and mine NVY rewards", async () => {
//     const NVYTokenInstance = await NVYToken.deployed();
//     const IslandInstance = await Island.deployed();
//     const IslandCollectionSaleInstance = await IslandCollectionSale.deployed();

//     // Set all necessary addresses 
//     await NVYTokenInstance.addIslandContract(IslandInstance.address);
//     await IslandInstance.addNvyContractAddress(NVYTokenInstance.address);
//     await IslandInstance.addSaleContract(IslandCollectionSaleInstance.address);
//     await IslandCollectionSaleInstance.setIslandContractAddress(IslandInstance.address);

//     // Account[1] is buying the Island
//     await IslandCollectionSaleInstance.buyIsland(1000, {from: accounts[1], value: 1000});

//     // Account[1] is collecting his reward
//     await IslandInstance.collectReward(accounts[1], 1);

//     // await new Promise(resolve => setTimeout(resolve, 25000));

//     // Account[1] has increased NVY balance
//     const nvyBalance = await NVYTokenInstance.balanceOf(accounts[0]);
//     console.log(nvyBalance.toString());

//     const nvyBalance1 = await NVYTokenInstance.balanceOf(accounts[1]);
//     console.log(nvyBalance1.toNumber());

//     const island1 = await IslandInstance.getIslandInfo(1);
//     console.log(island1);

//     // WTF balance is 24 ?

//     // const ethBalance = await web3.eth.getBalance(accounts[0]);

//     // console.log(ethBalance);

//     // // WTF 160000018 ?
//     // assert.equal(balance, 160000018, "Wrong NVY initial value");
//   });
// });
