import { CaptainSettingsDocument } from "@app/shared-library/schemas/entity/schema.captain.settings";
import { CaptainTraitDocument, TraitBonusType } from "@app/shared-library/schemas/entity/schema.captain.trait";
import { FileUtils } from "@app/shared-library/shared-library.file.utils";
import { Model } from "mongoose";

const fs = require('fs');

export class FixtureLoader {

    constructor(
        private captainTraitModel: Model<CaptainTraitDocument>,
        private captainSettingsModel: Model<CaptainSettingsDocument>,
    ) {
    }

    async loadFixtures() {
        const traitsCount = await this.captainTraitModel.count();
        if (traitsCount == 0) {
            FileUtils.LoadFixture('entity-service', '1_captain_traits.json', async (fixtures: any) => {
                for (let i = 0; i < fixtures.length; i++) {
                    const fixture = fixtures[i];
                    const trait = new this.captainTraitModel();
                    trait.index = fixture.index;
                    trait.description = fixture.description;
                    trait.bonusType = fixture.bonusType == 'Flat' ? TraitBonusType.FLAT : TraitBonusType.PERCENT;
                    trait.shipStatsAffected = fixture.shipStatsAffected;
                    await trait.save();
                }
            });
        }

        const settingsCount = await this.captainSettingsModel.count();
        if (settingsCount == 0) {
            FileUtils.LoadFixture('entity-service', '2_captain_traits_settings.json', async (fixture: any) => {
                const settings = new this.captainSettingsModel();
                settings.commonCaptainDefaultTraits = fixture.commonCaptainDefaultTraits;
                settings.rareCaptainDefaultTraits = fixture.rareCaptainDefaultTraits;
                settings.epicCaptainDefaultTraits = fixture.epicCaptainDefaultTraits;
                settings.legendaryCaptainDefaultTraits = fixture.legendaryCaptainDefaultTraits;
                await settings.save();
            });
        }
    }

}