import { Web3Service, Web3ServiceGrpcClientName, Web3ServiceName } from '@app/shared-library/gprc/grpc.web3.service';
import { NotificationService, NotificationServiceGrpcClientName, NotificationServiceName } from '@app/shared-library/gprc/grpc.notification.service';
import { Project, ProjectDocument, ProjectState } from '@app/shared-library/schemas/marketplace/schema.project';
import { Collection, CollectionDocument } from '@app/shared-library/schemas/marketplace/schema.collection';
import { CollectionItem, CollectionItemDocument, MarketplaceState } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { Mint, MintDocument } from '@app/shared-library/schemas/marketplace/schema.mint';
import { Bid, BidDocument } from '@app/shared-library/schemas/marketplace/schema.bid';
import { BadGatewayException, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { caching, MemoryCache } from 'cache-manager';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { join } from 'path';
import { ProjectCollection, ProjectDto } from './dto/dto.projects';
import { BidPlaceDto, BidDeleteDto } from './dto/dto.bids';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MarketplaceNftsType } from '@app/shared-library/workers/workers.marketplace';
import { lastValueFrom } from 'rxjs';
import { EthersConstants } from '@app/shared-library/ethers/ethers.constants';

import fetch from 'node-fetch';
import { SharedLibraryService } from '@app/shared-library';
import { FeedbackDto } from './dto/dto.feedback';
import { FixtureLoader } from './app.fixture.loader';
import { Faq, FaqDocument } from '@app/shared-library/schemas/marketplace/schema.faq';
import { Feedback, FeedbackDocument } from '@app/shared-library/schemas/marketplace/schema.feedback';
import { FavouriteDto } from './dto/dto.favourite';


@Injectable()
export class AppService implements OnModuleInit {

  private static readonly DefaultPaginationSize = 24;

  private fixtureLoader: FixtureLoader;
  private web3Service: Web3Service;
  private notificationService: NotificationService;

  private memoryCache: MemoryCache;

  private cronosTokenUsdPrice = 0;

  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Mint.name) private mintModel: Model<MintDocument>,
    @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
    @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>,
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
    @InjectModel(Faq.name) private faqModel: Model<FaqDocument>,
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
    @Inject(Web3ServiceGrpcClientName) private readonly web3ServiceGrpcClient: ClientGrpc,
    @Inject(NotificationServiceGrpcClientName) private readonly notificationServiceGrpcClient: ClientGrpc) {
  }

  async onModuleInit() {
    this.fixtureLoader = new FixtureLoader(this.projectModel, this.collectionModel, this.mintModel, this.collectionItemModel, this.faqModel);
    await this.fixtureLoader.loadFixtures();

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
          contractAddress: collection.contractAddress,
          chainId: collection.chainId,
        } as ProjectCollection);
      }

      result.push(project);
    }

    if (result.length == 0) {
      throw new BadGatewayException();
    }

    return result;
  }

  async dashboard(project?: string, days?: string) {
    const topSales = await this.topSales(project, days);

    let cronosTotal = 0;
    let captainsSold = 0;
    let islandsSold = 0;
    let shipsSold = 0;

    if (topSales) {
      topSales.forEach(sale => {
        cronosTotal += Number(sale.price);

        if (EthersConstants.CaptainContractAddress == sale.contractAddress) {
          captainsSold++;
        }
        if (EthersConstants.ShipContractAddress == sale.contractAddress) {
          shipsSold++;
        }
        if (EthersConstants.IslandContractAddress == sale.contractAddress) {
          islandsSold++;
        }
      });
    }

    return {
      tokenPerformance: {
        chainId: 25,
        chainName: 'Cronos',
        coinSymbol: 'CRO',
        performance: cronosTotal
      },
      captainsSold,
      islandsSold,
      shipsSold
    }
  }

  async topSales(project?: string, days?: string) {
    const response = [];
    const projects = await this.getProjects();
    if (projects) {
      const query = {
        contractAddress: [],
        marketplaceNftsType: MarketplaceNftsType.SOLD,
        lastUpdated: { $gte: this.getDaysSeconds(days) }
      };
      projects[0].collections.forEach(collection => {
        query.contractAddress.push(collection.contractAddress);
      });
      const topSaleResult = await this.collectionItemModel
        .find(query)
        .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])
        .limit(9)
        .sort([['price', -1], ['lastUpdated', 1]]);
      topSaleResult.forEach(f => {
        response.push({
          tokenId: f.tokenId,
          tokenUri: f.tokenUri,
          seller: f.seller,
          owner: f.owner,
          price: f.price,
          image: f.image,
          rarity: f.rarity,
          lastUpdated: f.lastUpdated,
          contractAddress: f.contractAddress,
          chainId: f.chainId,
          marketplaceState: f.marketplaceState,
          chainName: 'Cronos',
          coinSymbol: 'CRO',
          showPrice: true
        });
      });
      return response;
    }
  }

  async getCollection(contractAddress: string) {
    const collection = await this.collectionModel.findOne({ contractAddress }).select(['-_id', '-__v']);
    if (!collection) {
      throw new BadGatewayException();
    }
    return collection;
  }

  async getCollectionItems(marketplaceNftsType: MarketplaceNftsType, address: string, page?: number, size?: number, rarity?: string) {
    let initialPage = page;
    if (!page) {
      page = 1;
      initialPage = 1;
    }
    const pageSize = size ? size : AppService.DefaultPaginationSize;

    const query = {
      contractAddress: address.toLowerCase()
    };
    const rarityCheck = rarity && (rarity == 'Legendary' || rarity == 'Epic' || rarity == 'Rare' || rarity == 'Common');
    if (rarityCheck) {
      query['rarity'] = rarity;
    }

    let nftType = 'all';
    if (marketplaceNftsType == MarketplaceNftsType.LISTED) {
      nftType = 'listed';
      query['marketplaceState'] = marketplaceNftsType;
    } else if (marketplaceNftsType == MarketplaceNftsType.SOLD) {
      nftType = 'sold';
      query['marketplaceState'] = marketplaceNftsType;
    }

    const count = await this.collectionItemModel.countDocuments(query);
    const getUrl = (p: number) => `https://navy.online/marketplace/collection/${address}/${nftType}?page=${p}`;

    const self = this;
    async function databaseQuery(marketplaceState: MarketplaceNftsType, sortCriteria: string) {
      const criteria = {
        contractAddress: address
      };
      if (rarityCheck) {
        criteria['rarity'] = rarity;
      }
      return await self.collectionItemModel
        .find(criteria)
        .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])
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
        contractAddress: address.toLowerCase(),
        marketplaceState: MarketplaceNftsType.LISTED,
        seller: owner
      })
      .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])));

    result.push(...await this.collectionItemModel
      .find({
        contractAddress: address.toLowerCase(),
        marketplaceState: MarketplaceNftsType.ALL,
        owner: owner.toLocaleLowerCase()
      })
      .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits']));

    return result;
  }

  async getCollectionItem(address: string, tokenId: string) {
    const collectionItem = await this.collectionItemModel.findOne({
      contractAddress: address,
      tokenId
    }).select(['-_id', '-__v', '-needUpdate']);

    const traits = (collectionItem.traits as any).map(f => {
      if (f.value == '1') {
        f.value = 'Ship damage bonus'
      }
      return {
        trait_type: f.trait_type,
        value: f.value
      };
    });

    return {
      tokenId: collectionItem.tokenId,
      tokenUri: collectionItem.tokenUri,
      owner: collectionItem.owner,
      price: collectionItem.price,
      image: collectionItem.image,
      rarity: collectionItem.rarity,
      contractAddress: collectionItem.contractAddress,
      chainId: collectionItem.chainId,
      chainName: 'Cronos',
      coinSymbol: 'CRO',
      visuals: collectionItem.visuals,
      traits,
      showPrice: true
    }
  }

  async getMintByCollection(collectionAddress: string) {
    const collection = await this.getCollection(collectionAddress);
    if (!collection) {
      throw new BadGatewayException();
    }
    const mint = await this.mintModel.findOne({ _id: collection.mint }).select(['-_id', '-__v']);
    if (!mint) {
      throw new BadGatewayException();
    }
    return mint;
  }

  async bidPlace(dto: BidPlaceDto) {
    const contractAddress = dto.contractAddress;
    const tokenId = dto.tokenId;

    // Check if such collection and token exists
    if (await this.collectionModel.findOne({ contractAddress }) &&
      await this.collectionItemModel.findOne({ contractAddress, tokenId })) {
      // Check if there is no the same bid
      if (!await this.bidModel.findOne({
        contractAddress,
        tokenId,
        price: { $gte: dto.price }
      })) {
        const bid = new this.bidModel();
        bid.contractAddress = dto.contractAddress;
        bid.tokenId = dto.tokenId;
        bid.price = dto.price;
        bid.bidInitiatorAddress = dto.bidInitiatorAddress;
        const newBid = await bid.save();
        return {
          bidId: newBid.id
        }
      } else {
        throw new BadGatewayException('Ubale to place a bid');
      }
    } else {
      throw new BadGatewayException('No such collection or token');
    }
  }

  async bidDelete(dto: BidDeleteDto) {
    const bid = await this.bidModel.deleteOne({ id: dto.bidId });
    if (bid) {
      return {
        success: true
      }
    } else {
      return {
        success: false
      }
    }
  }

  async bids(contractAddress: string, tokenId: string) {
    return await this.bidModel.find({
      contractAddress,
      tokenId
    }).select(['-_id', '-__v']);
  }

  async favouriteAdd(favouriteDto: FavouriteDto) {

  }

  async favouriteRemove(favouriteDto: FavouriteDto) {

  }

  async faq() {
    const faq = await this.faqModel.findOne();
    return faq.questionsAndAnswers;
  }

  async feedback(feedbackDto: FeedbackDto) {
    const newFeedback = new this.feedbackModel;
    newFeedback.subject = feedbackDto.subject;
    newFeedback.message = feedbackDto.message;
    newFeedback.from = feedbackDto.from;
    await newFeedback.save();

    // TODO replace by kafka
    await lastValueFrom(this.notificationService.SendEmail({
      recipient: 'hello@navy.online',
      subject: feedbackDto.subject,
      message: feedbackDto.message,
      sender: feedbackDto.from
    }));
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


  private getDaysSeconds(days?: string) {
    const nowTimeSeconds = Number(Number(Date.now() / 1000).toFixed(0));
    const daySeconds = 24 * 60 * 60;
    let seconds = nowTimeSeconds;
    if (days) {
      if (days == '7') {
        seconds = nowTimeSeconds - (daySeconds * 7);
      } else if (days == '30') {
        seconds = nowTimeSeconds - (daySeconds * 30);
      } else {
        seconds = nowTimeSeconds - daySeconds;
      }
    }
    return seconds;
  }
}
