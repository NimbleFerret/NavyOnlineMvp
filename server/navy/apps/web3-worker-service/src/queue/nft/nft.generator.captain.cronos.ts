import { SharedLibraryService } from "@app/shared-library";
import { CaptainSettingsDocument } from "@app/shared-library/schemas/entity/schema.captain.settings";
import { CaptainTraitDocument } from "@app/shared-library/schemas/entity/schema.captain.trait";
import { Collection } from "@app/shared-library/schemas/marketplace/schema.collection";
import { CollectionItemDocument } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { Contract } from "ethers";
import { Model } from "mongoose";
import { NftGeneratorCaptainBase } from "./nft.generator.captain.base";

export class NftGeneratorCaptainCronos extends NftGeneratorCaptainBase {

    constructor(
        collection: Collection,
        captainTraitModel: Model<CaptainTraitDocument>,
        captainSettingsModel: Model<CaptainSettingsDocument>,
        collectionItemModel: Model<CollectionItemDocument>,
        private contract: Contract
    ) {
        super(
            collection,
            SharedLibraryService.CRONOS_CHAIN_NAME,
            SharedLibraryService.CRONOS_CHAIN_ID,
            SharedLibraryService.CRONOS_TOKEN_SYMBOL,
            captainTraitModel,
            captainSettingsModel,
            collectionItemModel
        );

        this.init().then();
    }

    async mintNft(owner: string, metadataUrl: string) {
        await this.contract.grantCaptain(owner, metadataUrl);
    }

}