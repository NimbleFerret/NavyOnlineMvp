const Island = artifacts.require("Island");

module.exports = function (deployer) {
  deployer.deploy(Island);
};