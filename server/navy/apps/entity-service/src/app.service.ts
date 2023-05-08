import { SharedLibraryService } from '@app/shared-library';
import { GenerateCaptainTraitsRequest, GetRandomCaptainTraitRequest, GetRandomCaptainTraitResponse } from '@app/shared-library/gprc/grpc.entity.service';
import { CaptainSettings, CaptainSettingsDocument } from '@app/shared-library/schemas/entity/schema.captain.settings';
import { CaptainTrait, CaptainTraitDocument } from '@app/shared-library/schemas/entity/schema.captain.trait';
import { Rarity } from '@app/shared-library/shared-library.main';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FixtureLoader } from './app.fixture.loader';

@Injectable()
export class AppService implements OnModuleInit {

  private traitsCount = 0;
  private commonCaptainTraits = 0;
  private rareCaptainTraits = 0;
  private epicCaptainTraits = 0;
  private legendaryCaptainTraits = 0;

  constructor(
    @InjectModel(CaptainTrait.name) private captainTraitModel: Model<CaptainTraitDocument>,
    @InjectModel(CaptainSettings.name) private captainSettingsModel: Model<CaptainSettingsDocument>
  ) {
  }

  async onModuleInit() {
    const fixtureLoader = new FixtureLoader(this.captainTraitModel, this.captainSettingsModel);
    await fixtureLoader.loadFixtures();

    const captainSettings = await this.captainSettingsModel.findOne();
    this.commonCaptainTraits = captainSettings.commonCaptainDefaultTraits;
    this.rareCaptainTraits = captainSettings.rareCaptainDefaultTraits;
    this.epicCaptainTraits = captainSettings.epicCaptainDefaultTraits;
    this.legendaryCaptainTraits = captainSettings.legendaryCaptainDefaultTraits;
  }

  async getRandomCaptainTrait(request: GetRandomCaptainTraitRequest) {
    const response = {
      traits: []
    } as GetRandomCaptainTraitResponse;
    const excludeIndexes: number[] = [];
    if (request.excludeIds && request.excludeIds.length > 0) {
      excludeIndexes.push(...request.excludeIds);
    }

    for (let i = 0; i < request.count; i++) {
      const index = SharedLibraryService.GetRandomIntInRangeExcept(1, this.traitsCount, excludeIndexes);
      const trait = await this.captainTraitModel.findOne({ index });
      response.traits.push({
        index: trait.index,
        description: trait.description,
        bonusType: trait.bonusType,
        shipStatsAffected: trait.shipStatsAffected
      });
      excludeIndexes.push(trait.index);
    }

    return response;
  }

  async generateCaptainTraits(request: GenerateCaptainTraitsRequest) {
    let traits = this.commonCaptainTraits;
    switch (request.rarity) {
      case Rarity.LEGENDARY:
        traits = this.legendaryCaptainTraits;
        break;
      case Rarity.EPIC:
        traits = this.epicCaptainTraits;
        break;
      case Rarity.RARE:
        traits = this.rareCaptainTraits;
        break;
    }
    return await this.getRandomCaptainTrait({
      count: traits,
      excludeIds: []
    });
  }

}
