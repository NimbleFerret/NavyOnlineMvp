const NVY = artifacts.require("./NVY.sol");
const AKS = artifacts.require("./AKS.sol");

contract("Tokens", accounts => {
    it("...Should return owner NVY balance", async () => {
        const NVYInstance = await NVY.deployed();
        const AKSInstance = await AKS.deployed();

        // Give some money to account[1]
        const amount = web3.utils.toWei('500', 'ether');
        await NVYInstance.transfer(accounts[1], amount);
        await AKSInstance.transfer(accounts[1], amount);

        const balanceNVY = await NVYInstance.balanceOf(accounts[1]);
        const balanceAKS = await AKSInstance.balanceOf(accounts[1]);

        console.log('Account[1] NVY balance: ' + balanceNVY.toString());
        console.log('Account[1] AKS balance: ' + balanceAKS.toString());

        assert.equal(balanceNVY, '500000000000000000000', "Wrong NVY initial value");
        assert.equal(balanceAKS, '500000000000000000000', "Wrong AKS initial value");
    });
});