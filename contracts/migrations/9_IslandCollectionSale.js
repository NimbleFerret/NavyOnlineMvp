const IslandCollectionSale = artifacts.require("IslandCollectionSale");

module.exports = function (deployer) {
  deployer.deploy(IslandCollectionSale, 1000, 1000);
};