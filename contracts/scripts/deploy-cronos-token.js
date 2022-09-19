const hre = require("hardhat");

async function main() {
    await deployContractByName('AKS');
    await deployContractByName('NVY');

    await deployContractByName('FounderCaptainCollectionSale', 100, 1);

    await deployContractByName('Captain');
    await deployContractByName('Island');
    await deployContractByName('Ship');

    await deployContractByName('FounderIslandCollectionSale', 42, 1);

    await deployContractByName('FounderShipCollectionSale', 500, 1);

    await deployContractByName('ShipTemplate');
}

async function deployContractByName(name, arg1, arg2) {
    const Contract = await hre.ethers.getContractFactory(name);

    let contract = (arg1 && arg2) ? await Contract.deploy(arg1, arg2) : await Contract.deploy();

    await contract.deployed();

    console.log(name + " deployed to: ", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });