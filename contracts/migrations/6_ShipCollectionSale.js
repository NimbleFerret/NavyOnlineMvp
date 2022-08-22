const ShipCollectionSale = artifacts.require("ShipCollectionSale");

module.exports = function (deployer) {
  deployer.deploy(ShipCollectionSale, 1000, 10);
};