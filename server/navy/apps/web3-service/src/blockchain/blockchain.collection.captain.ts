// import { Logger } from "@nestjs/common";
// import { Contract } from "ethers";
// import { Constants } from "../app.constants";
// import { NftGenerator } from "../nft/nft.generator";
// import { BlockchainCollection } from "./blockchain.collection";

// export class BlockchainCollectionCaptain extends BlockchainCollection {

//     constructor(
//         nftGenerator: NftGenerator,
//         collectionSaleContract: Contract,
//         collectionContract: Contract,
//         marketplaceContract: Contract
//     ) {
//         super(nftGenerator, collectionSaleContract, collectionContract, marketplaceContract);
//     }

//     async generateAndDeployNft(sender: string, metadata: string, contractAddress: string, collectionContract: Contract) {
//         if (contractAddress.toLocaleLowerCase() == Constants.CaptainContractAddress) {
//             await collectionContract.grantCaptain(sender, metadata);
//             Logger.log(`Captain granted to: ${sender} !`);
//         } else {
//             Logger.error(`Wrong contract address! Expected captain address: ${Constants.CaptainContractAddress}, received: ${contractAddress}`);
//         }
//     }

// }