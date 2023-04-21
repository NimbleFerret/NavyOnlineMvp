import { Collection, CollectionDocument } from "@app/shared-library/schemas/marketplace/schema.collection";
import { CollectionItem, CollectionItemDocument } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { Mint, MintDocument } from "@app/shared-library/schemas/marketplace/schema.mint";
import { MarketplaceNftsType } from "@app/shared-library/workers/workers.marketplace";
import { BadGatewayException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AppService } from "../app.service";

@Injectable()
export class CollectionApiService {

    constructor(
        @InjectModel(Mint.name) private mintModel: Model<MintDocument>,
        @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
        @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>,
    ) {
    }

    async getCollection(contractAddress: string) {
        const collection = await this.collectionModel.findOne({ contractAddress }).select(['-_id', '-__v']);
        if (!collection) {
            throw new BadGatewayException();
        }
        return collection;
    }

    async getCollectionItems(marketplaceNftsType: MarketplaceNftsType, address: string, page?: number, size?: number, rarity?: string) {
        let initialPage = page;
        if (!page) {
            page = 1;
            initialPage = 1;
        }
        const pageSize = size ? size : AppService.DefaultPaginationSize;

        const query = {
            contractAddress: address.toLowerCase()
        };
        const rarityCheck = rarity && (rarity == 'Legendary' || rarity == 'Epic' || rarity == 'Rare' || rarity == 'Common');
        if (rarityCheck) {
            query['rarity'] = rarity;
        }

        let nftType = 'all';
        if (marketplaceNftsType == MarketplaceNftsType.LISTED) {
            nftType = 'listed';
            query['marketplaceState'] = marketplaceNftsType;
        } else if (marketplaceNftsType == MarketplaceNftsType.SOLD) {
            nftType = 'sold';
            query['marketplaceState'] = marketplaceNftsType;
        }

        const count = await this.collectionItemModel.countDocuments(query);
        const getUrl = (p: number) => `https://navy.online/marketplace/collection/${address}/${nftType}?page=${p}`;

        const self = this;
        async function databaseQuery(marketplaceState: MarketplaceNftsType, sortCriteria: string) {
            const criteria = {
                contractAddress: address
            };
            if (rarityCheck) {
                criteria['rarity'] = rarity;
            }
            return await self.collectionItemModel
                .find(criteria)
                .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .sort([['marketplaceState', 1], [sortCriteria, -1]]);
        }

        const result = await databaseQuery(marketplaceNftsType, marketplaceNftsType == MarketplaceNftsType.ALL ? 'tokenId' : 'lastUpdated');

        result.forEach(r => {
            if (r.seller) {
                r.owner = r.seller;
                r.seller = undefined;
            }
        });

        let pages = Math.ceil(count / pageSize);
        let next = null;
        let prev = null;

        if (pages < 1) {
            pages = 1;
        }
        if (pages > 1) {
            next = ((page - 1) * pageSize) + result.length < (count) ? getUrl(Number(initialPage) + 1) : null;
            prev = page > 1 ? getUrl(page - 1) : null;
        }

        const response = {
            info: {
                count,
                pages,
                next,
                prev
            },
            result
        };

        return response;
    }

    async getCollectionItemsByOwner(address: string, owner: string) {
        const result = [];

        address = address.toLowerCase();
        owner = owner.toLowerCase();

        result.push(...(await this.collectionItemModel
            .find({
                contractAddress: address.toLowerCase(),
                marketplaceState: MarketplaceNftsType.LISTED,
                seller: owner
            })
            .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])));

        result.push(...await this.collectionItemModel
            .find({
                contractAddress: address.toLowerCase(),
                marketplaceState: MarketplaceNftsType.ALL,
                owner: owner.toLocaleLowerCase()
            })
            .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits']));

        return result;
    }

    async getCollectionItem(address: string, tokenId: string) {
        const collectionItem = await this.collectionItemModel.findOne({
            contractAddress: address,
            tokenId
        }).select(['-_id', '-__v', '-needUpdate']);

        const traits = (collectionItem.traits as any).map(f => {
            if (f.value == '1') {
                f.value = 'Ship damage bonus'
            }
            return {
                trait_type: f.trait_type,
                value: f.value
            };
        });

        return {
            tokenId: collectionItem.tokenId,
            tokenUri: collectionItem.tokenUri,
            owner: collectionItem.owner,
            price: collectionItem.price,
            image: collectionItem.image,
            rarity: collectionItem.rarity,
            contractAddress: collectionItem.contractAddress,
            chainId: collectionItem.chainId,
            chainName: 'Cronos',
            coinSymbol: 'CRO',
            visuals: collectionItem.visuals,
            traits,
            showPrice: true
        }
    }

    async getMintByCollection(collectionAddress: string) {
        const collection = await this.getCollection(collectionAddress);
        if (!collection) {
            throw new BadGatewayException();
        }
        const mint = await this.mintModel.findOne({ _id: collection.mint }).select(['-_id', '-__v']);
        if (!mint) {
            throw new BadGatewayException();
        }
        return mint;
    }
}