import { CollectionItem } from "./schemas/marketplace/schema.collection.item";
import { Document } from "mongoose";
import { CollectionItemResponseObject } from "apps/marketplace-service/src/dto/dto.collection";

export class Converter {

    public static ConvertCollectionItem(collectionItem: CollectionItem & Document, favourite: boolean) {
        const item: CollectionItemResponseObject = {
            tokenId: collectionItem.tokenId,
            tokenUri: collectionItem.tokenUri,
            seller: collectionItem.seller,
            owner: collectionItem.owner,
            price: collectionItem.price,
            image: collectionItem.image,
            visuals: collectionItem.visuals,
            traits: collectionItem.traits,
            rarity: collectionItem.rarity,
            contractAddress: collectionItem.contractAddress,
            collectionName: collectionItem.collectionName,
            chainId: collectionItem.chainId,
            marketplaceState: collectionItem.marketplaceState,
            lastUpdated: collectionItem.lastUpdated,
            chainName: collectionItem.chainName,
            tokenSymbol: collectionItem.tokenSymbol,
            favourite
        };
        return item;
    }

}