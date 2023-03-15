import Moralis from "moralis";
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { ClientGrpc } from "@nestjs/microservices";
import { Model } from "mongoose";
// import { CaptainEntity } from "@app/shared-library/entities/entity.captain";
import { IslandEntity } from "@app/shared-library/entities/entity.island";
import { ShipEntity } from "@app/shared-library/entities/entity.ship";
import { AssetType, IslandSize, Rarity, ShipSize, Terrain } from "@app/shared-library/shared-library.main";
import { GetAndSyncUserAssetsResponse } from "@app/shared-library/gprc/grpc.web3.service";
import { Ship, ShipDocument } from "@app/shared-library/schemas/schema.ship";
import { Captain, CaptainDocument } from "@app/shared-library/schemas/schema.captain";
import { Island, IslandDocument } from "@app/shared-library/schemas/schema.island";
import { WorldService, WorldServiceGrpcClientName, WorldServiceName } from "@app/shared-library/gprc/grpc.world.service";
import { lastValueFrom } from "rxjs";
import { UserAvatar, UserAvatarDocument } from "@app/shared-library/schemas/schema.user.avatar";
import { CollectionItem, CollectionItemDocument } from "@app/shared-library/schemas/marketplace/schema.collection.item";

@Injectable()
export class MoralisService implements OnModuleInit {

    public static UpdateCollections = true;

    private readonly logger = new Logger(MoralisService.name);

    private readonly chain = EvmChain.CRONOS_TESTNET;
    private readonly apiKey = "aQrAItXuznpPv1pEXAgPIIwcVqwaehaPHpB9WmGo0eP1dGUdmzyt5SYfmstQslBF";

    private worldService: WorldService;

    constructor(
        @Inject(WorldServiceGrpcClientName) private readonly worldServiceGrpcClient: ClientGrpc,
        @InjectModel(Captain.name) private captainModel: Model<CaptainDocument>,
        @InjectModel(Ship.name) private shipModel: Model<ShipDocument>,
        @InjectModel(Island.name) private islandModel: Model<IslandDocument>,
        @InjectModel(UserAvatar.name) private userAvatarModel: Model<UserAvatarDocument>,
        @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>
    ) {

    }

    async onModuleInit() {
        this.worldService = this.worldServiceGrpcClient.getService<WorldService>(WorldServiceName);
        await Moralis.start({
            apiKey: this.apiKey
        });

        // const response = await Moralis.EvmApi.nft.getContractNFTs({
        //     address: Constants.CaptainContractAddress,
        //     chain: this.chain
        // });

        // console.log(response.toJSON());

        // await this.syncCollections();

        // const response = await Moralis.EvmApi.nft.getWalletNFTs({
        //     address: '0xE6193b058bBD559E8E0Df3a48202a3cDEC852Ab6',
        //     chain: this.chain,
        //     tokenAddresses: [
        //         Constants.CaptainContractAddress,
        //     ]
        // }) as any;
        // console.log(response.data.result);
    }

    async getAndSyncUserAssets(ethAddress: string) {
        const result: GetAndSyncUserAssetsResponse = {};

        const user = await this.userAvatarModel.findOne({
            'userProfile.ethAddress': ethAddress
        });

        if (user) {
            const userAssets = await Promise.all([this.getUserTokenBalances(user), this.getUserNFTs(user)])

            result.aks = userAssets[0].aks;
            result.nvy = userAssets[0].nvy;

            // result.captains = userAssets[1].captains;
            result.ships = userAssets[1].ships;
            result.islands = userAssets[1].islands;
        } else {
            this.logger.error('No such user');
        }

        return result;
    }

    private async getUserTokenBalances(userAvatar: UserAvatarDocument) {
        let nvy = 0;
        let aks = 0;

        // const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        //     address: userAvatar.userProfile.ethAddress,
        //     chain: this.chain,
        // }) as any;

        // response.data.forEach(f => {
        //     if (f.token_address == Constants.NvyContractAddress) {
        //         nvy = Number(ethers.utils.formatEther(f.balance));
        //     }
        //     if (f.token_address == Constants.AksContractAddress) {
        //         aks = Number(ethers.utils.formatEther(f.balance));
        //     }
        // });

        return {
            nvy, aks
        }
    }

    private async getUserNFTs(userAvatar: UserAvatarDocument) {
        // const captains: CaptainEntity[] = [];
        const ships: ShipEntity[] = [];
        const islands: IslandEntity[] = [];

        // const response = await Moralis.EvmApi.nft.getWalletNFTs({
        //     address: userAvatar.userProfile.ethAddress,
        //     chain: this.chain,
        //     tokenAddresses: [
        //         Constants.CaptainContractAddress,
        //         Constants.ShipContractAddress,
        //         Constants.IslandContractAddress
        //     ]
        // }) as any;

        // const total = response.data.total

        // if (total > 0) {
        //     for (const entity of response.data.result) {
        //         switch (entity.token_address) {
        //             case Constants.CaptainContractAddress: {
        //                 captains.push(await this.getCaptainNFTsByOwnerAddress(entity, userAvatar));
        //                 break;
        //             }
        //             case Constants.ShipContractAddress: {
        //                 ships.push(await this.getShipNFTsByOwnerAddress(entity, userAvatar));
        //                 break;
        //             }
        //             case Constants.IslandContractAddress: {
        //                 islands.push(await this.getIslandNFTsByOwnerAddress(entity, userAvatar));
        //                 break;
        //             }
        //         }
        //     }
        // }

        return {
            captains,
            ships,
            islands
        }
    }

    // private async getCaptainNFTsByOwnerAddress(entity: any, userAvatar: UserAvatarDocument) {
    //     const metadataAttributes = JSON.parse(entity.metadata).attributes;
    //     const playerCaptainEntity = {
    //         id: entity.token_id,
    //         miningRewardNVY: metadataAttributes[0]['miningRewardNVY'],
    //         stakingRewardNVY: metadataAttributes[1]['stakingRewardNVY'],
    //         traits: metadataAttributes[2]['traits'],
    //         level: metadataAttributes[3]['level'],
    //         rarity: metadataAttributes[4]['rarity'],
    //         bg: metadataAttributes[5]['bg'],
    //         acc: metadataAttributes[6]['acc'],
    //         head: metadataAttributes[7]['head'],
    //         haircutOrHat: metadataAttributes[8]['haircutOrHat'],
    //         clothes: metadataAttributes[9]['clothes'],
    //     } as CaptainEntity;

    //     const captain = await this.captainModel.findOne({
    //         tokenId: playerCaptainEntity.id
    //     });

    //     if (!captain) {
    //         const newCaptain = new this.captainModel();
    //         newCaptain.tokenId = playerCaptainEntity.id;
    //         newCaptain.owner = userAvatar;
    //         newCaptain.miningRewardNVY = playerCaptainEntity.miningRewardNVY;
    //         newCaptain.stakingRewardNVY = playerCaptainEntity.stakingRewardNVY;
    //         newCaptain.traits = playerCaptainEntity.traits;
    //         newCaptain.level = playerCaptainEntity.level;
    //         newCaptain.rarity = Rarity[Rarity[playerCaptainEntity.rarity]];
    //         newCaptain.bg = playerCaptainEntity.bg;
    //         newCaptain.acc = playerCaptainEntity.acc;
    //         newCaptain.head = playerCaptainEntity.head;
    //         newCaptain.haircutOrHat = playerCaptainEntity.haircutOrHat;
    //         newCaptain.clothes = playerCaptainEntity.clothes;
    //         await newCaptain.save();
    //     } else {
    //         captain.owner = userAvatar;
    //         captain.miningRewardNVY = playerCaptainEntity.miningRewardNVY;
    //         captain.stakingRewardNVY = playerCaptainEntity.stakingRewardNVY;
    //         captain.traits = playerCaptainEntity.traits;
    //         captain.level = playerCaptainEntity.level;
    //         await captain.save();
    //     }

    //     return playerCaptainEntity;
    // }

    // private async getShipNFTsByOwnerAddress(entity: any, userAvatar: UserAvatarDocument) {
    //     const metadataAttributes = JSON.parse(entity.metadata).attributes;
    //     const playerShipEntity = {
    //         id: entity.token_id,
    //         type: AssetType.COMMON,
    //         hull: metadataAttributes[0]['hull'],
    //         armor: metadataAttributes[1]['armor'],
    //         maxSpeed: metadataAttributes[2]['maxSpeed'],
    //         accelerationStep: metadataAttributes[3]['accelerationStep'],
    //         accelerationDelay: metadataAttributes[4]['accelerationDelay'],
    //         rotationDelay: metadataAttributes[5]['rotationDelay'],
    //         fireDelay: metadataAttributes[6]['fireDelay'],
    //         cannons: metadataAttributes[7]['cannons'],
    //         cannonsRange: metadataAttributes[8]['cannonsRange'],
    //         cannonsDamage: metadataAttributes[9]['cannonsDamage'],
    //         traits: metadataAttributes[10]['traits'],
    //         level: metadataAttributes[11]['level'],
    //         rarity: metadataAttributes[12]['rarity'],
    //         size: metadataAttributes[13]['size'],
    //         currentIntegrity: metadataAttributes[14]['currentIntegrity'],
    //         maxIntegrity: metadataAttributes[15]['maxIntegrity'],
    //         windows: metadataAttributes[16]['windows'],
    //         anchor: metadataAttributes[17]['anchor'],
    //     } as ShipEntity;

    //     const ship = await this.shipModel.findOne({
    //         tokenId: playerShipEntity.id
    //     });

    //     if (!ship) {
    //         const newShip = new this.shipModel();
    //         newShip.tokenId = playerShipEntity.id;
    //         newShip.owner = userAvatar;
    //         newShip.hull = playerShipEntity.hull;
    //         newShip.armor = playerShipEntity.armor;
    //         newShip.maxSpeed = playerShipEntity.maxSpeed;
    //         newShip.accelerationStep = playerShipEntity.accelerationStep;
    //         newShip.accelerationDelay = playerShipEntity.accelerationDelay;
    //         newShip.rotationDelay = playerShipEntity.rotationDelay;
    //         newShip.fireDelay = playerShipEntity.fireDelay;
    //         newShip.cannons = playerShipEntity.cannons;
    //         newShip.cannonsRange = playerShipEntity.cannonsRange;
    //         newShip.cannonsDamage = playerShipEntity.cannonsDamage;
    //         newShip.size = ShipSize[ShipSize[playerShipEntity.size]];
    //         newShip.rarity = Rarity[Rarity[playerShipEntity.rarity]];
    //         newShip.level = playerShipEntity.level;
    //         newShip.windows = playerShipEntity.windows;
    //         newShip.anchor = playerShipEntity.anchor;
    //         newShip.currentIntegrity = playerShipEntity.currentIntegrity;
    //         newShip.maxIntegrity = playerShipEntity.maxIntegrity;
    //         await newShip.save();
    //     } else {
    //         ship.hull = playerShipEntity.hull;
    //         ship.owner = userAvatar;
    //         ship.armor = playerShipEntity.armor;
    //         ship.maxSpeed = playerShipEntity.maxSpeed;
    //         ship.accelerationStep = playerShipEntity.accelerationStep;
    //         ship.accelerationDelay = playerShipEntity.accelerationDelay;
    //         ship.rotationDelay = playerShipEntity.rotationDelay;
    //         ship.cannons = playerShipEntity.cannons;
    //         ship.cannonsRange = playerShipEntity.cannonsRange;
    //         ship.cannonsDamage = playerShipEntity.cannonsDamage;
    //         ship.traits = playerShipEntity.traits;
    //         ship.level = playerShipEntity.level;
    //         await ship.save();
    //     }

    //     return playerShipEntity;
    // }

    // private async getIslandNFTsByOwnerAddress(entity: any, user: UserAvatarDocument) {
    //     const metadataAttributes = JSON.parse(entity.metadata).attributes;
    //     const playerIslandEntity = {
    //         id: entity.token_id,
    //         level: metadataAttributes[0]['level'],
    //         rarity: metadataAttributes[1]['rarity'],
    //         terrain: metadataAttributes[2]['terrain'],
    //         miningRewardNVY: metadataAttributes[3]['miningRewardNVY'],
    //         shipAndCaptainFee: metadataAttributes[4]['shipAndCaptainFee'],
    //         maxMiners: metadataAttributes[5]['maxMiners'],
    //         minersFee: metadataAttributes[6]['minersFee'],
    //         x: metadataAttributes[7]['x'],
    //         y: metadataAttributes[8]['y']
    //     } as IslandEntity;

    //     // TODO add size also
    //     // TODO redeploy contract and replace terrain type to number

    //     const island = await this.islandModel.findOne({
    //         tokenId: playerIslandEntity.id
    //     });

    //     if (!island) {
    //         try {
    //             const newIsland = new this.islandModel();
    //             newIsland.tokenId = playerIslandEntity.id;
    //             newIsland.owner = user;
    //             newIsland.x = playerIslandEntity.x;
    //             newIsland.y = playerIslandEntity.y;
    //             newIsland.terrain = Terrain.GREEN;
    //             // newIsland.terrain = Terrain[Terrain[playerIslandEntity.terrain]];
    //             newIsland.rarity = Rarity[Rarity[playerIslandEntity.rarity]];
    //             newIsland.size = IslandSize.SMALL;
    //             newIsland.mining = false;
    //             newIsland.miningStartedAt = 0;
    //             newIsland.miningDurationSeconds = 604800;
    //             newIsland.miningRewardNVY = 45;
    //             newIsland.shipAndCaptainFee = 10;
    //             newIsland.minersFee = 5;
    //             newIsland.miners = 0;
    //             newIsland.maxMiners = 3;
    //             newIsland.level = 0;
    //             await newIsland.save();
    //             await lastValueFrom(this.worldService.AddNewIslandToSector({
    //                 tokenId: newIsland.tokenId,
    //             }));
    //         } catch (e) {
    //             this.logger.error('Unable to add island to sector', e);
    //         }
    //     } else {
    //         island.owner = user;
    //         await island.save();
    //     }

    //     return playerIslandEntity;
    // }


    //

    // @Cron(CronExpression.EVERY_MINUTE)
    // async syncCollections() {
    //     if (MoralisService.UpdateCollections) {
    //         await this.updateAndSaveCollectionInfo(Constants.CaptainContractAddress);
    //         MoralisService.UpdateCollections = false;
    //     }
    // }

    private async updateAndSaveCollectionInfo(address: string) {
        // Logger.log('Updatig collection ' + address + '...');
        // try {
        //     const response = await Moralis.EvmApi.nft.getContractNFTs({
        //         address,
        //         chain: this.chain,
        //     });
        //     const nfts: any = response.toJSON();
        //     console.log(nfts);
        //     // TODO check iteration in advance
        //     let newItems = 0;
        //     for (const n of nfts) {
        //         const nft: any = n;
        //         if (!await this.collectionItemModel.findOne({ tokenId: nft.tokenId })) {
        //             const collectionModel = new this.collectionItemModel();
        //             collectionModel.tokenAddress = nft.tokenAddress;
        //             collectionModel.tokenId = String(nft.tokenId);
        //             collectionModel.amount = nft.amount;
        //             collectionModel.tokenHash = nft.tokenHash;
        //             collectionModel.blockNumberMinted = nft.blockNumberMinted;
        //             collectionModel.contractType = nft.contractType;
        //             collectionModel.name = nft.name;
        //             collectionModel.symbol = nft.symbol;
        //             collectionModel.tokenUri = nft.tokenUri;
        //             collectionModel.metadata = new Map();
        //             collectionModel.metadata.set('name', nft.metadata.name);
        //             collectionModel.metadata.set('description', nft.metadata.description);
        //             collectionModel.metadata.set('image', nft.metadata.image);
        //             collectionModel.metadata.set('attributes', nft.metadata.attributes);
        //             collectionModel.minterAddress = String(nft.minterAddress);
        //             collectionModel.chain = String(nft.chain);
        //             await collectionModel.save();
        //             newItems++;
        //         }
        //     }
        //     if (newItems > 0) {
        //         Logger.log('Updatig collection ' + address + ' done. Items added: ' + newItems);
        //     }
        // } catch (e) {
        //     Logger.error('Updatig collection ' + address + ' error.', e);
        // }
        // Logger.log('Updatig collection ' + address + ' finished.');
    }
}