const Shipyard = artifacts.require("Shipyard");

module.exports = function (deployer) {
  deployer.deploy(Shipyard);
};