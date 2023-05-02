import { CollectionItem } from "./schemas/marketplace/schema.collection.item";
import { Document } from "mongoose";

export class Converter {

    public static ConvertCollectionItem(collectionItem: CollectionItem & Document, favourite: boolean) {
        return {
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
            chainName: 'Cronos',
            coinSymbol: 'CRO',
            favourite
        }
    }

}