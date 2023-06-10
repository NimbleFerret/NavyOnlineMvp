import { Contract, ethers } from "ethers";
import { CronosConstants } from "./cronos.constants";

export interface CronosConfig {
    Captain: any;
    Collection: any;
    Marketplace: any;
}

export class CronosProvider {
    // Contract events
    public static readonly EventNftMinted = 'NftMinted';
    public static readonly EventNftGenerated = 'NftGenerated';
    public static readonly EventNftListed = 'NftListed';
    public static readonly EventNftDelisted = 'NftDelisted';
    public static readonly EventNftSold = 'NftSold';

    // Token contracts
    public aksContract: Contract;
    public nvyContract: Contract;

    // NFT contracts
    public captainContract: Contract;
    public shipContract: Contract;
    public islandContract: Contract;

    // Sale contracts
    public captainCollectionContract: Contract;
    public shipCollectionContract: Contract;
    public islandCollectionContract: Contract;

    // Marketplace contracts
    public captainMarketplaceContract: Contract;
    public shipMarketplaceContract: Contract;
    public islandMarketplaceContract: Contract;

    // Ship stats contracts
    public shipTemplateContract: Contract;

    private readonly ethersProvider = new ethers.providers.JsonRpcProvider('https://evm-t3.cronos.org');
    private readonly backendWallet = new ethers.Wallet('4378e658ba1f1e392b07582ad1e533bc55d606aaa22138cb08e83132cd3635e1', this.ethersProvider);


    async init(nftContractAbi: any, collectionContractAbi: any, marketplaceContractAbi: any) {
        // this.aksContract = new ethers.Contract(CronosConstants.AksContractAddress, Aks, this.ethersProvider).connect(this.backendWallet);
        // this.nvyContract = new ethers.Contract(CronosConstants.NvyContractAddress, Nvy, this.ethersProvider).connect(this.backendWallet);

        this.captainContract = new ethers.Contract(CronosConstants.CaptainContractAddress, nftContractAbi, this.ethersProvider).connect(this.backendWallet);
        // this.shipContract = new ethers.Contract(CronosConstants.ShipContractAddress, Ship, this.ethersProvider).connect(this.backendWallet);
        // this.islandContract = new ethers.Contract(CronosConstants.IslandContractAddress, Island, this.ethersProvider).connect(this.backendWallet);

        this.captainCollectionContract = new ethers.Contract(CronosConstants.CaptainCollectionContractAddress, collectionContractAbi, this.ethersProvider);
        // this.shipCollectionContract = new ethers.Contract(CronosConstants.ShipCollectionContractAddress, CollectionSale, this.ethersProvider);
        // this.islandCollectionContract = new ethers.Contract(CronosConstants.IslandCollectionContractAddress, CollectionSale, this.ethersProvider);

        this.captainMarketplaceContract = new ethers.Contract(CronosConstants.CaptainMarketplaceContractAddress, marketplaceContractAbi, this.ethersProvider);
        // this.shipMarketplaceContract = new ethers.Contract(CronosConstants.ShipMarketplaceContractAddress, Marketplace, this.ethersProvider);
        // this.islandMarketplaceContract = new ethers.Contract(CronosConstants.IslandMarketplaceContractAddress, Marketplace, this.ethersProvider);
    }
}