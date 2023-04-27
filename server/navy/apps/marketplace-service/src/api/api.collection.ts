import { EthersConstants } from "@app/shared-library/ethers/ethers.constants";
import { Collection, CollectionDocument } from "@app/shared-library/schemas/marketplace/schema.collection";
import { CollectionItem, CollectionItemDocument } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { Mint, MintDocument } from "@app/shared-library/schemas/marketplace/schema.mint";
import { UserProfile } from "@app/shared-library/schemas/schema.user.profile";
import { MarketplaceNftsType } from "@app/shared-library/workers/workers.marketplace";
import { BadGatewayException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Document } from "mongoose";
import { AppService } from "../app.service";
import { AuthApiService } from "./api.auth";
import { FavouriteApiService } from "./api.favourite";

@Injectable()
export class CollectionApiService {

    constructor(
        private readonly favouriteService: FavouriteApiService,
        private readonly authService: AuthApiService,
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

    async getCollectionItems(
        authToken: string | undefined,
        marketplaceNftsType: MarketplaceNftsType,
        contractAddress: string,
        page?: number,
        size?: number,
        rarity?: string
    ) {
        let userProfile = undefined;
        if (authToken) {
            userProfile = await this.authService.checkTokenAndGetProfile(authToken);
        }

        let initialPage = page;
        if (!page) {
            page = 1;
            initialPage = 1;
        }
        const pageSize = size ? size : AppService.DefaultPaginationSize;

        // ----------------------------------
        // Query collection items count
        // ----------------------------------

        const query = {
            contractAddress: contractAddress.toLowerCase()
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

        // ----------------------------------
        // Query collection items
        // ----------------------------------

        const self = this;
        async function databaseQuery(sortCriteria: string) {
            const criteria = {
                contractAddress: contractAddress.toLowerCase()
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

        const result = await databaseQuery(marketplaceNftsType == MarketplaceNftsType.ALL ? 'tokenId' : 'lastUpdated');

        // ----------------------------------
        // Prepare paginated response
        // ----------------------------------

        const resultItems = this.convertCollectionItems(result, true);

        let pages = Math.ceil(count / pageSize);
        let next = null;
        let prev = null;

        if (pages < 1) {
            pages = 1;
        }
        if (pages > 1) {
            const getUrl = (p: number) => {
                let url = '';
                url = `https://navy.online/marketplace/collection/${contractAddress}/${nftType}?page=${p}`;
                if (size) {
                    url += '&size=' + size;
                }
                if (rarity) {
                    url += '&rarity=' + size;
                }
                return url;
            };

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
            result: resultItems
        };

        // ----------------------------------
        // Fill user favourite items 
        // ----------------------------------

        if (userProfile) {
            await this.fillCollectionItemsFavourites(response.result, userProfile);
        }

        return response;
    }

    async getCollectionItemsByOwner(authToken: string) {
        const userProfile = await this.authService.checkTokenAndGetProfile(authToken);

        if (userProfile.ethAddress && userProfile.ethAddress.length > 0) {
            const owner = userProfile.ethAddress.toLowerCase();
            const collectionItems = [];

            collectionItems.push(...(await this.collectionItemModel
                .find({
                    marketplaceState: MarketplaceNftsType.LISTED,
                    seller: owner
                })
                .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])));

            collectionItems.push(...await this.collectionItemModel
                .find({
                    marketplaceState: MarketplaceNftsType.ALL,
                    owner: owner.toLocaleLowerCase()
                })
                .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits']));

            const resultItems = this.convertCollectionItems(collectionItems.sort(function (a, b) { return b.collectionAddress - a.collectionAddress }), true);
            await this.fillCollectionItemsFavourites(resultItems, userProfile);

            const result = {
                captains: {
                    total: 0,
                    items: []
                },
                ships: {
                    total: 0,
                    items: []
                },
                islands: {
                    total: 0,
                    items: []
                },
            };

            resultItems.forEach(f => {
                switch (f.collectionAddress) {
                    case EthersConstants.CaptainContractAddress:
                        result.captains.total++;
                        result.captains.items.push(f);
                        break;
                    case EthersConstants.ShipContractAddress:
                        result.ships.total++;
                        result.ships.items.push(f);
                        break;
                    case EthersConstants.IslandContractAddress:
                        result.islands.total++;
                        result.islands.items.push(f);
                        break;
                }
            });

            return result;
        } else {
            return {};
        }
    }

    async getCollectionItem(authToken: string | undefined, address: string, tokenId: string) {
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

        const collectionItemResult = {
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
        };

        if (authToken) {
            const userProfile = await this.authService.checkTokenAndGetProfile(authToken);
            const userFavourites = await this.favouriteService.favoutires(userProfile);
            collectionItemResult['favourite'] = userFavourites.filter(f => f.tokenId == collectionItemResult.tokenId).length > 0;
        }

        return collectionItemResult;
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

    private convertCollectionItems(collectionItems: any, swapSeller = false) {
        const resultItems = [];
        collectionItems.forEach(r => {
            const resultItem = {
                tokenId: r.tokenId,
                tokenUri: r.tokenUri,
                owner: r.owner,
                price: r.price,
                image: r.image,
                rarity: r.rarity,
                lastUpdated: r.lastUpdated,
                contractAddress: r.contractAddress,
                chainId: r.chainId,
                marketplaceState: r.marketplaceState
            };
            if (r.seller && swapSeller) {
                resultItem.owner = r.seller;
            }
            resultItems.push(resultItem);
        });
        return resultItems;
    }

    private async fillCollectionItemsFavourites(collectionItems: any, userProfile: UserProfile & Document) {
        const userFavourites = await this.favouriteService.favoutires(userProfile);
        const favouriteCollectionItemsIds = new Set<number>();
        userFavourites.forEach(f => {
            favouriteCollectionItemsIds.add(f.tokenId);
        });
        collectionItems.forEach(f => {
            if (favouriteCollectionItemsIds.has(f.tokenId)) {
                f['favourite'] = true;
            } else {
                f['favourite'] = false;
            }
        });
    }
}