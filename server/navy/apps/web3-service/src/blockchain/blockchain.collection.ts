import { MarketplaceNFT } from "@app/shared-library/entities/entity.marketplace.nft";
import { NftType } from "@app/shared-library/shared-library.main";
import { Logger } from "@nestjs/common";
import { Contract, ethers } from "ethers";
import { NftGenerator } from "../nft/nft.generator";
import { EthersProvider } from "./blockchain.ethers.provider";

enum MarketplaceNftsType {
    LISTED,
    SOLD
}

export abstract class BlockchainCollection {

    constructor(
        public nftGenerator: NftGenerator,
        private collectionSaleContract: Contract,
        private collectionContract: Contract,
        private marketplaceContract: Contract
    ) {
        this.collectionSaleContract.on(EthersProvider.EventGenerateToken, async (sender: string, contractAddress: string) => {
            try {
                Logger.log(`Generating new ${this.nftTypeToString()} for user: ${sender}. contractAddress: ${contractAddress}`);

                const tokensLeft = (await this.collectionSaleContract.tokensLeft()).toNumber();
                const tokensTotal = (await this.collectionSaleContract.tokensTotal()).toNumber();
                const metadata = await this.nftGenerator.generateNft(tokensLeft, tokensTotal);

                this.generateAndDeployNft(sender, metadata, contractAddress, this.collectionContract).then();

                Logger.log(`Generated new ${this.nftTypeToString()} for user: ${sender} !`);
            } catch (e) {
                Logger.error(`Error ${this.nftTypeToString()} generation for user: ${sender} !`, e);
            }
        });
    }

    public async updateMarketplaceNfts() {
        await this.updateMarketplaceNftsByType(MarketplaceNftsType.LISTED);
    }

    private async updateMarketplaceNftsByType(marketplaceNftsType: MarketplaceNftsType) {
        const nfts = marketplaceNftsType == MarketplaceNftsType.LISTED ?
            await this.marketplaceContract.getNftsListed() : await this.marketplaceContract.getNftsSold();

        const marketplaceNFTs: MarketplaceNFT[] = nfts.map(nft => {
            const marketplaceNFT: MarketplaceNFT = {
                nftContract: nft.nftContract,
                tokenId: nft.tokenId.toNumber(),
                tokenUri: nft.tokenUri,
                seller: nft.seller,
                owner: nft.owner,
                price: ethers.utils.formatEther(nft.price),
                image: '',
                lastUpdated: nft.lastUpdated.toNumber()
            };
            return marketplaceNFT;
        });

        console.log(marketplaceNFTs);

        for (const nft of marketplaceNFTs) {
            const response = await fetch(nft.tokenUri);
            const body = await response.json();
            nft.image = body.image;
        }

        console.log(marketplaceNFTs);

        return marketplaceNFTs;
    }

    abstract generateAndDeployNft(sender: string, metadata: string, contractAddress: string, collectionContract: Contract);

    private nftTypeToString() {
        switch (this.nftGenerator.nftType) {
            case NftType.CAPTAIN:
                return 'captain';
            case NftType.SHIP:
                return 'ship';
            case NftType.ISLAND:
                return 'island';
        }
    }
}