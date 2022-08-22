const ShipGenerator = artifacts.require("ShipGenerator");

module.exports = function (deployer) {
  deployer.deploy(ShipGenerator);
};