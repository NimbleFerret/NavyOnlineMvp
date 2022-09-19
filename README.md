Client 

All the client side code, written in Haxe and Heaps.io. It uses moralis V1 sdk in order to show the user web3 plugin and sign transactions.
It also has two separate modules, engine and src. Engine is a code that calculates all the online logic and physics on both server and client side. 
It needs to be compiled into JS code and then copied into server folder.

Contracts

Contains all the contracts and deploy + verify tools on cronos testnet.

NVY - our main token
AKS - our secondary token

Captain - NFT, contains buying + upgrades + staking and mining logic
Ship - NFT, contains buying + upgrades + repair logic
Island - NFT, contains buying + upgrades + mining logic 

Sale - contract for collection sale

Server

Standalone server. It uses websockets, nest.js, mongo, moralis V2 for data fetching, ethers.js for conracts calls.

Haxe > JS compiled engines are used here, one for battle gameplay and one for island.

When user buyed NFT server will wait for a smarrt contract callback and generate it. All NFT images for metdata are generated on server and then it goes to moralis IPFS.

Server will also damage user's ship if needed and grant a token rewards by completion of daily tasks.