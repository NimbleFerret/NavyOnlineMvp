import { Web3Service, Web3ServiceGrpcClientName, Web3ServiceName } from '@app/shared-library/gprc/grpc.web3.service';
import { NotificationService, NotificationServiceGrpcClientName, NotificationServiceName } from '@app/shared-library/gprc/grpc.notification.service';
import { Project, ProjectDocument, ProjectState } from '@app/shared-library/schemas/marketplace/schema.project';
import { Collection, CollectionDocument } from '@app/shared-library/schemas/marketplace/schema.collection';
import { Mint, MintDocument } from '@app/shared-library/schemas/marketplace/schema.mint';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { caching, MemoryCache } from 'cache-manager';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { join } from 'path';
import { ProjectCollection, ProjectDto } from './dto/dto.projects';
import { CollectionItem, CollectionItemDocument } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MarketplaceNftsType } from '@app/shared-library/workers/workers.marketplace';
import fetch from 'node-fetch';
import { lastValueFrom } from 'rxjs';

const fs = require('fs');

@Injectable()
export class AppService implements OnModuleInit {

  private static readonly DefaultPaginationSize = 10;

  private web3Service: Web3Service;
  private notificationService: NotificationService;

  private memoryCache: MemoryCache;

  private cronosTokenUsdPrice = 0;

  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Mint.name) private mintModel: Model<MintDocument>,
    @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
    @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>,
    @Inject(Web3ServiceGrpcClientName) private readonly web3ServiceGrpcClient: ClientGrpc,
    @Inject(NotificationServiceGrpcClientName) private readonly notificationServiceGrpcClient: ClientGrpc) {
  }

  async onModuleInit() {
    function loadFixture(fixtureName: string, callback: Function) {
      try {
        fs.readFile(join(__dirname, '..', 'marketplace-service') + '/fixtures/' + fixtureName, async (error: any, data: any) => {
          if (error) {
            Logger.error('Unable to load ' + fixtureName + ' fixture!', error);
          } else {
            const fixture = JSON.parse(data);
            Logger.log(fixtureName + ' loaded!');
            callback(fixture);
          }
        });
      } catch (error) {
        Logger.error('Unable to load ' + fixtureName + ' fixture!', error);
      }
    }

    const projectDetails = await this.projectModel.findOne();
    if (!projectDetails) {
      loadFixture('1_projects.json', async (fixtures: any) => {
        const fixture = fixtures[0];
        const project = new this.projectModel();
        project.name = fixture.name;
        project.active = fixture.active;
        project.state = fixture.state;
        project.supportedChains = fixture.supportedChains;

        loadFixture('2_collections.json', async (fixtures: any) => {
          const collections = [new this.collectionModel(), new this.collectionModel()];

          for (let i = 0; i < fixtures.length; i++) {
            collections[i].name = fixtures[i].name;
            collections[i].description = fixtures[i].description;
            collections[i].chainId = fixtures[i].chainId;
            collections[i].address = fixtures[i].address.toLowerCase();
            collections[i].collectionSize = fixtures[i].collectionSize;
            collections[i].collectionItemsLeft = fixtures[i].collectionItemsLeft;
            collections[i].preview = fixtures[i].preview;
          }

          loadFixture('3_mints.json', async (fixtures: any) => {
            for (let i = 0; i < fixtures.length; i++) {
              const mint = new this.mintModel();

              fixtures[i].mintingDetails.forEach(mintingDetail => {
                mintingDetail.saleContractAddress = mintingDetail.saleContractAddress.toLowerCase();
                mintingDetail.tokenContractAddress = mintingDetail.tokenContractAddress.toLowerCase();
              });

              mint.mintingEnabled = fixtures[i].mintingEnabled;
              mint.mintingStartTime = fixtures[i].mintingStartTime;
              mint.mintingEndTime = fixtures[i].mintingEndTime;
              mint.mintingDetails = fixtures[i].mintingDetails;

              mint.collectionSize = fixtures[i].collectionSize;
              mint.collectionItemsLeft = fixtures[i].collectionItemsLeft;
              mint.collectionPreview = fixtures[i].collectionPreview;

              mint.descriptionTitle = fixtures[i].descriptionTitle;
              mint.descriptionDescription = fixtures[i].descriptionDescription;

              mint.profitability = fixtures[i].profitability;
              mint.profitabilityTitle = fixtures[i].profitabilityTitle;
              mint.profitabilityValue = fixtures[i].profitabilityValue;
              mint.profitabilityDescription = fixtures[i].profitabilityDescription;

              mint.rarity = fixtures[i].rarity;
              mint.rarityTitle = fixtures[i].rarityTitle;
              mint.rarityDescription = fixtures[i].rarityDescription;
              mint.rarityItems = fixtures[i].rarityItems;

              mint.nftParts = fixtures[i].nftParts;
              mint.nftPartsTitle = fixtures[i].nftPartsTitle;
              mint.nftPartsDescription = fixtures[i].nftPartsDescription;
              mint.nftPartsItems = fixtures[i].nftPartsItems;

              collections[i].mint = await mint.save();
              project.collections.push(await collections[i].save());
            }

            await project.save();
          });
        });
      });

      loadFixture('4_collection_items.json', async (fixtures: any) => {
        for (let i = 0; i < fixtures.length; i++) {
          const collectionItem = new this.collectionItemModel();
          collectionItem.id = fixtures[i].id;
          collectionItem.tokenId = fixtures[i].tokenId;
          collectionItem.tokenUri = fixtures[i].tokenUri;
          collectionItem.seller = fixtures[i].seller;
          collectionItem.owner = fixtures[i].owner;
          collectionItem.price = fixtures[i].price;
          collectionItem.image = fixtures[i].image;
          collectionItem.rarity = fixtures[i].rarity;
          collectionItem.lastUpdated = fixtures[i].lastUpdated;
          collectionItem.needUpdate = fixtures[i].needUpdate;
          collectionItem.nftContract = fixtures[i].nftContract;
          collectionItem.chainId = fixtures[i].chainId;
          collectionItem.chainName = fixtures[i].chainName;
          collectionItem.coinSymbol = fixtures[i].coinSymbol;
          collectionItem.marketplaceState = fixtures[i].marketplaceState;
          await collectionItem.save();
        }
      });
    }

    this.web3Service = this.web3ServiceGrpcClient.getService<Web3Service>(Web3ServiceName);
    this.notificationService = this.notificationServiceGrpcClient.getService<NotificationService>(NotificationServiceName);

    this.memoryCache = await caching('memory', {
      max: 100,
      ttl: 60 * 1000 * 15, // 15 mins cache
    });

    await this.updateCronosTokenUsdPrice();
  }

  // ------------------------------------
  // Api
  // ------------------------------------

  async getProjects() {
    const result: ProjectDto[] = [];

    const projects = await this.projectModel.find({
      projectState: {
        "$ne": ProjectState.DISABLED
      }
    });

    for (const p of projects) {
      const project: ProjectDto = {
        name: p.name,
        state: p.state,
        active: p.active,
        collections: []
      };

      for (const c of p.collections) {
        const collection = await this.collectionModel.findById(c);
        project.collections.push({
          name: collection.name,
          address: collection.address,
          chainId: collection.chainId,
        } as ProjectCollection);
      }

      result.push(project);
    }

    return result;
  }

  async getCollection(address: string) {
    return this.collectionModel.findOne({ address: address }).select(['-_id', '-__v']);
  }

  async getCollectionItems(marketplaceNftsType: MarketplaceNftsType, address: string, page?: number) {
    let initialPage = page;
    if (!page) {
      page = 1;
      initialPage = 1;
    }
    const pageSize = AppService.DefaultPaginationSize;

    const query = {
      nftContract: address.toLowerCase(),
      marketplaceState: marketplaceNftsType
    };
    const count = await this.collectionItemModel.countDocuments(query);

    let nftType = 'all';
    if (marketplaceNftsType == MarketplaceNftsType.LISTED) {
      nftType = 'listed';
    } else if (marketplaceNftsType == MarketplaceNftsType.SOLD) {
      nftType = 'sold';
    }
    const getUrl = (p: number) => `https://navy.online/marketplace/collection/${address}/${nftType}?page=${p}`;

    const self = this;
    async function databaseQuery(marketplaceState: MarketplaceNftsType, sortCriteria: string) {
      return await self.collectionItemModel
        .find({
          nftContract: address
        })
        .select(['-_id', '-__v', '-id', '-needUpdate'])
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort([['marketplaceState', 1], [sortCriteria, -1]]);
    }

    const result = await databaseQuery(marketplaceNftsType, marketplaceNftsType == MarketplaceNftsType.ALL ? 'tokenId' : 'lastUpdated');

    result.forEach(r => {
      if (r.seller) {
        r.owner = r.seller;
        r.seller = undefined;
      }
    });

    let pages = Math.ceil(count / pageSize);
    let next = null;
    let prev = null;

    if (pages < 1) {
      pages = 1;
    }
    if (pages > 1) {
      next = ((page - 1) * pageSize) + result.length < (count) ? getUrl(Number(initialPage) + 1) : null;
      prev = page > 1 ? getUrl(page - 1) : null;
    }

    const response = {
      info: {
        count,
        pages,
        next,
        prev
      },
      result
    };

    return response;
  }

  async getCollectionItemsByOwner(address: string, owner: string) {
    const result = [];

    address = address.toLowerCase();
    owner = owner.toLowerCase();

    result.push(...(await this.collectionItemModel
      .find({
        nftContract: address.toLowerCase(),
        marketplaceState: MarketplaceNftsType.LISTED,
        seller: owner
      })
      .select(['-_id', '-__v', '-id', '-needUpdate'])));

    result.push(...await this.collectionItemModel
      .find({
        nftContract: address.toLowerCase(),
        marketplaceState: MarketplaceNftsType.ALL,
        owner: owner.toLocaleLowerCase()
      })
      .select(['-_id', '-__v', '-id', '-needUpdate']));

    return result;
  }

  async getMintByCollection(collectionAddress: string) {
    const collection = await this.getCollection(collectionAddress);
    return this.mintModel.findOne({ _id: collection.mint }).select(['-_id', '-__v']);
  }

  async getNotifications(walletAddress: string) {
    const signUpResult = await lastValueFrom(this.notificationService.GetUserNotifications({
      walletAddress
    }));
    return signUpResult;
  }

  async readNotifications(walletAddress: string) {
    const signUpResult = await lastValueFrom(this.notificationService.ReadUserNotifications({
      walletAddress
    }));
  }

  getCronosUsdPrice() {
    return {
      usd: this.cronosTokenUsdPrice
    };
  }

  // ------------------------------------

  @Cron(CronExpression.EVERY_10_MINUTES)
  async updateCronosTokenUsdPrice() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=crypto-com-chain&vs_currencies=usd');
      const body = await response.json();
      this.cronosTokenUsdPrice = body['crypto-com-chain'].usd;
    } catch (e) {
      Logger.error(e);
    }
  }

}
