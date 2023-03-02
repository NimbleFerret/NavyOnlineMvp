import { Contract, ethers } from "ethers";
import { EthersConstants } from "./ethers.constants";

export interface EthersConfig {
    Captain: any;
    Aks: any;
    Nvy: any;
    Ship: any;
    Island: any;
    ShipTemplate: any;
    CollectionSale: any;
    Marketplace: any;
}

export class EthersProvider {
    // Contract events
    public static readonly EventGenerateToken = 'GenerateToken';

    // Token contracts
    public aksContract: Contract;
    public nvyContract: Contract;

    // NFT contracts
    public captainContract: Contract;
    public shipContract: Contract;
    public islandContract: Contract;

    // Sale contracts
    public captainCollectionSaleContract: Contract;
    public shipCollectionSaleContract: Contract;
    public islandCollectionSaleContract: Contract;

    // Marketplace contracts
    public captainMarketplaceContract: Contract;
    public shipMarketplaceContract: Contract;
    public islandMarketplaceContract: Contract;

    // Ship stats contracts
    public shipTemplateContract: Contract;

    private readonly ethersProvider = new ethers.providers.JsonRpcProvider('https://evm-t3.cronos.org');
    private readonly backendWallet = new ethers.Wallet('4378e658ba1f1e392b07582ad1e533bc55d606aaa22138cb08e83132cd3635e1', this.ethersProvider);

    // 0xd6d6EE855ADDBD0eC5591DdF3D1266EcaecD97B6
    // 4378e658ba1f1e392b07582ad1e533bc55d606aaa22138cb08e83132cd3635e1

    async init(config: EthersConfig) {
        const Aks = config.Aks;
        const Nvy = config.Nvy;
        const Captain = config.Captain;
        const Ship = config.Ship;
        const Island = config.Island;
        const ShipTemplate = config.ShipTemplate;
        const CollectionSale = config.CollectionSale;
        const Marketplace = config.Marketplace;

        this.aksContract = new ethers.Contract(EthersConstants.AksContractAddress, Aks, this.ethersProvider).connect(this.backendWallet);
        this.nvyContract = new ethers.Contract(EthersConstants.NvyContractAddress, Nvy, this.ethersProvider).connect(this.backendWallet);

        this.captainContract = new ethers.Contract(EthersConstants.CaptainContractAddress, Captain, this.ethersProvider).connect(this.backendWallet);
        this.shipContract = new ethers.Contract(EthersConstants.ShipContractAddress, Ship, this.ethersProvider).connect(this.backendWallet);
        this.islandContract = new ethers.Contract(EthersConstants.IslandContractAddress, Island, this.ethersProvider).connect(this.backendWallet);

        this.shipTemplateContract = new ethers.Contract(EthersConstants.ShipTemplateContractAddress, ShipTemplate, this.ethersProvider);

        this.captainCollectionSaleContract = new ethers.Contract(EthersConstants.CaptainCollectionSaleContractAddress, CollectionSale, this.ethersProvider);
        this.shipCollectionSaleContract = new ethers.Contract(EthersConstants.ShipCollectionSaleContractAddress, CollectionSale, this.ethersProvider);
        this.islandCollectionSaleContract = new ethers.Contract(EthersConstants.IslandCollectionSaleContractAddress, CollectionSale, this.ethersProvider);

        this.captainMarketplaceContract = new ethers.Contract(EthersConstants.CaptainMarketplaceContractAddress, Marketplace, this.ethersProvider);
    }
}