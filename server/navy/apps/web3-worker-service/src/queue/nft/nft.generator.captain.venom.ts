import { SharedLibraryService } from "@app/shared-library";
import { VenomProvider } from "@app/shared-library/blockchain/venom/venom.provider";
import { CaptainSettingsDocument } from "@app/shared-library/schemas/entity/schema.captain.settings";
import { CaptainTraitDocument } from "@app/shared-library/schemas/entity/schema.captain.trait";
import { Collection } from "@app/shared-library/schemas/marketplace/schema.collection";
import { CollectionItemDocument } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { Model } from "mongoose";
import { NftGeneratorCaptainBase } from "./nft.generator.captain.base";

export class NftGeneratorCaptainVenom extends NftGeneratorCaptainBase {

    constructor(
        collection: Collection,
        captainTraitModel: Model<CaptainTraitDocument>,
        captainSettingsModel: Model<CaptainSettingsDocument>,
        collectionItemModel: Model<CollectionItemDocument>
    ) {
        super(
            collection,
            SharedLibraryService.VENOM_CHAIN_NAME,
            SharedLibraryService.VENOM_CHAIN_ID,
            SharedLibraryService.VENOM_TOKEN_SYMBOL,
            captainTraitModel,
            captainSettingsModel,
            collectionItemModel
        );

        this.init().then();
    }

    async mintNft(owner: string, metadataUrl: string) {
        await VenomProvider.GrantCaptain(this.currentIndex, metadataUrl, owner);
    }

}