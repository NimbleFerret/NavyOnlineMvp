import { MintDetails, MintDetailsDocument } from '@app/shared-library/schemas/marketplace/schema.mint.details';
import { ProjectDetails, ProjectDetailsDocument } from '@app/shared-library/schemas/marketplace/schema.project';
import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { join } from 'path';

const fs = require('fs');

@Injectable()
export class AppService implements OnModuleInit {

  constructor(
    @InjectModel(ProjectDetails.name) private projectDetailsModel: Model<ProjectDetailsDocument>,
    @InjectModel(MintDetails.name) private mintDetailsModel: Model<MintDetailsDocument>) {
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

    const projectDetails = await this.projectDetailsModel.findOne();
    if (!projectDetails) {
      loadFixture('1_navy_project_details.json', async (fixture: any) => {
        const projectDetails = new this.projectDetailsModel();
        projectDetails.active = fixture.active;
        projectDetails.name = fixture.name;
        projectDetails.state = fixture.state;
        projectDetails.supportedChains = fixture.supportedChains;
        const newProjectDetails = await projectDetails.save();

        loadFixture('2_captains_mint.json', async (fixture: any) => {
          const captainMintDetails = new this.mintDetailsModel();
          captainMintDetails.projectDetails = newProjectDetails;

          captainMintDetails.mintingEnabled = fixture.mintingEnabled;
          captainMintDetails.mintingStartTime = fixture.mintingStartTime;
          captainMintDetails.mintingEndTime = fixture.mintingEndTime;
          captainMintDetails.mintDetails = fixture.mintDetails;

          captainMintDetails.collectionSize = fixture.collectionSize;
          captainMintDetails.collectionItemsLeft = fixture.collectionItemsLeft;
          captainMintDetails.collectionPreview = fixture.collectionPreview;

          captainMintDetails.descriptionTitle = fixture.descriptionTitle;
          captainMintDetails.descriptionDescription = fixture.descriptionDescription;

          captainMintDetails.profitability = fixture.profitability;
          captainMintDetails.profitabilityTitle = fixture.profitabilityTitle;
          captainMintDetails.profitabilityValue = fixture.profitabilityValue;
          captainMintDetails.profitabilityDescription = fixture.profitabilityDescription;

          captainMintDetails.rarity = fixture.rarity;
          captainMintDetails.rarityTitle = fixture.rarityTitle;
          captainMintDetails.rarityDescription = fixture.rarityDescription;
          captainMintDetails.rarityItems = fixture.rarityItems;

          captainMintDetails.nftParts = fixture.nftParts;
          captainMintDetails.nftPartsTitle = fixture.nftPartsTitle;
          captainMintDetails.nftPartsDescription = fixture.nftPartsDescription;
          captainMintDetails.nftPartsItems = fixture.nftPartsItems;

          await captainMintDetails.save();
        });
      });
    }
  }

  async getMintDetails() {
    const mintDetails = await this.mintDetailsModel.findOne().select(['-_id', '-__v']);
    if (mintDetails) {
      return mintDetails;
    } else {
      throw new BadRequestException();
    }
  }
}
