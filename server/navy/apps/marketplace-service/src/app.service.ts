import { MintDetails, MintDetailsDocument } from '@app/shared-library/schemas/schema.mint.details';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { join } from 'path';

const fs = require('fs');

@Injectable()
export class AppService implements OnModuleInit {

  constructor(@InjectModel(MintDetails.name) private mintDetailsModel: Model<MintDetailsDocument>,) {
  }

  async onModuleInit() {
    const mintDetails = await this.mintDetailsModel.findOne();
    if (!mintDetails) {

      try {
        fs.readFile(join(__dirname, '..', 'marketplace-service') + '/fixtures/1_captains_mint.json', async (error: any, data: any) => {
          if (error) {
            Logger.error('Unable to load 1_captains_mint.json fixture!', error);
          } else {
            const fixture = JSON.parse(data);
            const captainMintDetails = new this.mintDetailsModel();

            captainMintDetails.active = fixture.active;

            captainMintDetails.mintingEnabled = fixture.mintingEnabled;
            captainMintDetails.mintingStartTime = fixture.mintingStartTime;
            captainMintDetails.mintingPriceCronos = fixture.mintingPriceCronos;
            captainMintDetails.mintingPriceUSD = fixture.mintingPriceUSD;

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

            Logger.log('1_captains_mint.json loaded!');
          }
        });
      } catch (error) {
        Logger.error('Unable to load 1_captains_mint.json fixture!', error);
      }
    }
  }
}
