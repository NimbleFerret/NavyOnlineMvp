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

@Injectable()
export class EthersProvider implements OnModuleInit {

    // Contract events
    public static readonly EventGenerateCaptain = 'GenerateCaptain';
    public static readonly EventGenerateShip = 'GenerateShip';
    public static readonly EventGenerateIsland = 'GenerateIsland';

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

    // Ship stats contracts
    public shipTemplateContract: Contract;

    private readonly ethersProvider = new ethers.providers.JsonRpcProvider('https://evm-t3.cronos.org');
    private readonly backendWallet = new ethers.Wallet('ce2aa127a1564b00ea1ce3da8b8e57cd54f59f7ff132f0d7d91f0570d0e9d45f', this.ethersProvider);

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
    }
}