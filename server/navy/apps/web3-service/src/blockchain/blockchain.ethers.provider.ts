import { Injectable, OnModuleInit } from "@nestjs/common";
import { Contract, ethers } from 'ethers';
import { Constants } from '../app.constants';

import * as Captain from '../abi/Captain.json';
import * as Aks from '../abi/Aks.json';
import * as Nvy from '../abi/Nvy.json';
import * as Ship from '../abi/Ship.json';
import * as Island from '../abi/Island.json';
import * as ShipTemplate from '../abi/ShipTemplate.json';
import * as CollectionSale from '../abi/CollectionSale.json';
import * as Marketplace from '../abi/Marketplace.json';

@Injectable()
export class EthersProvider implements OnModuleInit {

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

    // Ship stats contracts
    public shipTemplateContract: Contract;

    private readonly ethersProvider = new ethers.providers.JsonRpcProvider('https://evm-t3.cronos.org');
    private readonly backendWallet = new ethers.Wallet('4378e658ba1f1e392b07582ad1e533bc55d606aaa22138cb08e83132cd3635e1', this.ethersProvider);

    // 0xd6d6EE855ADDBD0eC5591DdF3D1266EcaecD97B6
    // 4378e658ba1f1e392b07582ad1e533bc55d606aaa22138cb08e83132cd3635e1

    async onModuleInit() {
        this.aksContract = new ethers.Contract(Constants.AksContractAddress, Aks, this.ethersProvider).connect(this.backendWallet);
        this.nvyContract = new ethers.Contract(Constants.NvyContractAddress, Nvy, this.ethersProvider).connect(this.backendWallet);

        this.captainContract = new ethers.Contract(Constants.CaptainContractAddress, Captain, this.ethersProvider).connect(this.backendWallet);
        this.shipContract = new ethers.Contract(Constants.ShipContractAddress, Ship, this.ethersProvider).connect(this.backendWallet);
        this.islandContract = new ethers.Contract(Constants.IslandContractAddress, Island, this.ethersProvider).connect(this.backendWallet);

        this.shipTemplateContract = new ethers.Contract(Constants.ShipTemplateContractAddress, ShipTemplate, this.ethersProvider);

        this.captainCollectionSaleContract = new ethers.Contract(Constants.CaptainCollectionSaleContractAddress, CollectionSale, this.ethersProvider);
        this.shipCollectionSaleContract = new ethers.Contract(Constants.ShipCollectionSaleContractAddress, CollectionSale, this.ethersProvider);
        this.islandCollectionSaleContract = new ethers.Contract(Constants.IslandCollectionSaleContractAddress, CollectionSale, this.ethersProvider);

        this.captainMarketplaceContract = new ethers.Contract(Constants.CaptainMarketplaceContractAddress, Marketplace, this.ethersProvider);
    }
}