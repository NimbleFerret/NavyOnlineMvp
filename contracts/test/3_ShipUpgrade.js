const NVY = artifacts.require("./NVY.sol");
const AKS = artifacts.require("./AKS.sol");
const Ship = artifacts.require("./Ship.sol");
const ShipCollectionSale = artifacts.require("./ShipCollectionSale.sol");
const ShipGenerator = artifacts.require("./ShipGenerator.sol");
const ShipTemplate = artifacts.require("./ShipTemplate.sol");
const Shipyard = artifacts.require("./Shipyard.sol");

// TODO chain tests somehow
contract("Ship", accounts => {
    it("...Should be upgradable", async () => {
        const NVYInstance = await NVY.deployed();
        const AKSInstance = await AKS.deployed();
        const ShipInstance = await Ship.deployed();
        const ShipCollectionSaleInstance = await ShipCollectionSale.deployed();
        const ShipGeneratorInstance = await ShipGenerator.deployed();
        const ShipTemplateInstance = await ShipTemplate.deployed();
        const ShipyardInstance = await Shipyard.deployed();

        await ShipInstance.addSaleContract(ShipCollectionSaleInstance.address);
        await ShipCollectionSaleInstance.setShipContractAddress(ShipInstance.address);
        await ShipGeneratorInstance.updateSmallShipContractAddress(ShipTemplateInstance.address);
        await ShipInstance.setShipGeneratorContractAddress(ShipGeneratorInstance.address);
        await ShipInstance.setShipyardContractAddress(ShipyardInstance.address);
        await ShipyardInstance.setNvyContract(NVYInstance.address);
        await ShipyardInstance.setAksContract(AKSInstance.address);

        const amount = web3.utils.toWei('10', 'ether');
        await ShipCollectionSaleInstance.buyShip(amount, { from: accounts[1], value: amount });

        const amount2 = web3.utils.toWei('900', 'ether');
        await NVYInstance.transfer(accounts[1], amount2);
        await AKSInstance.transfer(accounts[1], amount2);

        // Level 1 upgrade
        await ShipInstance.upgrade(accounts[1], currentShipIndex);

        const balanceNVY = await NVYInstance.balanceOf(accounts[1]);
        const balanceAKS = await AKSInstance.balanceOf(accounts[1]);

        console.log('Account[1] NVY balance: ' + balanceNVY.toString());
        console.log('Account[1] AKS balance: ' + balanceAKS.toString());

        const currentShipIndex = await ShipInstance.getCurrentShipIndex();
        const ship = await ShipInstance.getShipInfoById(currentShipIndex);

        const postUpgradeLevel = ship.level;

        // TODO check that tokens were burned and spent
        const nvyTotalSupply = await NVYInstance.totalSupply();
        const aksTotalSupply = await AKSInstance.totalSupply();
        console.log('nvyTotalSupply: ' + nvyTotalSupply);
        console.log('aksTotalSupply: ' + aksTotalSupply);

        assert.equal(postUpgradeLevel, 2, "Ship was not upgraded");
    });
});
