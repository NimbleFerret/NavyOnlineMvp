import { SharedLibraryService } from '@app/shared-library';
import { GetRandomCaptainTraitRequest, GetRandomCaptainTraitResponse, ICaptainTrait } from '@app/shared-library/gprc/grpc.entity.service';
import { CaptainSettings, CaptainSettingsDocument } from '@app/shared-library/schemas/entity/schema.captain.settings';
import { CaptainTrait, CaptainTraitDocument } from '@app/shared-library/schemas/entity/schema.captain.trait';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FixtureLoader } from './app.fixture.loader';

@Injectable()
export class AppService implements OnModuleInit {

  private traitsCount = 0;

  constructor(
    @InjectModel(CaptainTrait.name) private captainTraitModel: Model<CaptainTraitDocument>,
    @InjectModel(CaptainSettings.name) private captainSettingsModel: Model<CaptainSettingsDocument>
  ) {
  }

  async onModuleInit() {
    const fixtureLoader = new FixtureLoader(this.captainTraitModel, this.captainSettingsModel);
    await fixtureLoader.loadFixtures();

    this.traitsCount = await this.captainTraitModel.count();

    await this.getRandomCaptainTrait({
      excludeIds: [],
      count: 3
    });
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
      const index = SharedLibraryService.GetRandomIntInRangeExcept(1, this.traitsCount + 1, excludeIndexes);
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

}
