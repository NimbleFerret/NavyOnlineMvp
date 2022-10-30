Deploy contracts:

npx hardhat run scripts/deploy-cronos-token.js --network cronosTestnet

Tokens verification:

npx hardhat verify --contract contracts/token/NVY.sol:NVY --network cronosTestnet 'ADDRESS'
npx hardhat verify --contract contracts/token/AKS.sol:AKS --network cronosTestnet 'ADDRESS'

Sell contracts verification:

npx hardhat verify --network cronosTestnet 'ADDRESS' --constructor-args .\scripts\arguments.js

NFT and template:
npx hardhat verify --network cronosTestnet 'ADDRESS'

test
