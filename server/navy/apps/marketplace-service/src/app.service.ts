import { Web3Service, Web3ServiceGrpcClientName, Web3ServiceName } from '@app/shared-library/gprc/grpc.web3.service';
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

const fs = require('fs');

@Injectable()
export class AppService implements OnModuleInit {

  private web3Service: Web3Service;
  private memoryCache: MemoryCache;

  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Mint.name) private mintModel: Model<MintDocument>,
    @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
    @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>,
    @Inject(Web3ServiceGrpcClientName) private readonly web3ServiceGrpcClient: ClientGrpc) {
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
            collections[i].address = fixtures[i].address;
            collections[i].size = fixtures[i].size;
            collections[i].tokensMinted = fixtures[i].tokensMinted;
            collections[i].preview = fixtures[i].preview;
          }

          loadFixture('3_mints.json', async (fixtures: any) => {
            for (let i = 0; i < fixtures.length; i++) {
              const mint = new this.mintModel();

              mint.mintingEnabled = fixtures[i].mintingEnabled;
              mint.mintingStartTime = fixtures[i].mintingStartTime;
              mint.mintingEndTime = fixtures[i].mintingEndTime;
              mint.mintingDetails = fixtures[i].mintingDetails;

              mint.collectionSize = fixtures[i].collectionSize;
              mint.collectionTokensMinted = fixtures[i].collectionTokensMinted;
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
    }

    this.web3Service = this.web3ServiceGrpcClient.getService<Web3Service>(Web3ServiceName);

    this.memoryCache = await caching('memory', {
      max: 100,
      ttl: 60 * 1000 * 15, // 15 mins cache
    });
  }

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

  async getCollectionItems(address: string) {
    return this.collectionItemModel.find({ tokenAddress: address.toLowerCase() }).select(['-_id', '-__v']);
  }

  async getMint(id: string) {
    return this.mintModel.findOne({ _id: id }).select(['-_id', '-__v']);
  }

  // const value = await this.memoryCache.get('projectMintDetails_' + id);
  // if (value) {
  //   const cachedResponse = JSON.parse(value as string);
  //   return cachedResponse;
  // } else {
  //   const mintDetails = await this.mintModel.find({
  //     projectDetails: id
  //   }).select(['-_id', '-__v']);
  //   if (mintDetails) {
  //     for (const details of mintDetails) {
  //       const collectionSaleDetails = await lastValueFrom(this.web3Service.GetCollectionSaleDetails({ address: details.saleContractAddress }));

  //       details.mintDetails.

  //         details.tokensLeft = collectionSaleDetails.tokensLeft;
  //       details.tokensTotal = collectionSaleDetails.tokensTotal;
  //     }
  //     await this.memoryCache.set('projectMintDetails_' + id, JSON.stringify(mintDetails));
  //     return mintDetails;
  //   } else {
  //     throw new BadRequestException();
  //   }
  // }
}
