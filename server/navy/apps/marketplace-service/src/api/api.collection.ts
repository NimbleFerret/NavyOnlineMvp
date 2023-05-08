import { EthersConstants } from "@app/shared-library/ethers/ethers.constants";
import { Collection, CollectionDocument } from "@app/shared-library/schemas/marketplace/schema.collection";
import { CollectionItem, CollectionItemDocument, MarketplaceState } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { Mint, MintDocument } from "@app/shared-library/schemas/marketplace/schema.mint";
import { UserProfile } from "@app/shared-library/schemas/schema.user.profile";
import { Converter } from "@app/shared-library/shared-library.converter";
import { Utils } from "@app/shared-library/utils";
import { BadGatewayException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Document } from "mongoose";
import { AppService } from "../app.service";
import { AuthApiService } from "./api.auth";
import { FavouriteApiService } from "./api.favourite";
import { GeneralApiService } from "./api.general";

@Injectable()
export class CollectionApiService {

    constructor(
        private readonly generalApiService: GeneralApiService,
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
            contractAddress: contractAddress.toLowerCase(),
            marketplaceState: {
                "$ne": MarketplaceState.SOLD
            }
        };

        const rarityCheck = rarity && (rarity == 'Legendary' || rarity == 'Epic' || rarity == 'Rare' || rarity == 'Common');
        if (rarityCheck) {
            query['rarity'] = rarity;
        }

        const count = await this.collectionItemModel.countDocuments(query);

        // ----------------------------------
        // Query collection items
        // ----------------------------------

        const result = await this.collectionItemModel.find(query)
            .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort([['marketplaceState', 1], ['tokenId', -1]]);

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
                url = `https://navy.online/marketplace/collection/${contractAddress}/all?page=${p}`;
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

    async getFavouriteCollectionItemsByOwner(authToken: string) {
        const userProfile = await this.authService.checkTokenAndGetProfile(authToken);
        if (userProfile) {
            const userFavourites = await this.favouriteService.getFavoutireNftByUserProfile(userProfile);
            const result = await this.collectionItemModel
                .find({ '_id': { $in: userFavourites } })
                .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])
                .sort([['marketplaceState', 1], ['tokenId', -1]]);
            const collectionItems = result.map(f => {
                const collectionItem = Converter.ConvertCollectionItem(f, true);
                return collectionItem;
            });
            return collectionItems;
        } else {
            return [];
        }
    }

    async tokensPerformance(days?: string) {
        const response = [];
        const projects = await this.generalApiService.getProjects();
        if (projects) {
            const query = {
                contractAddress: [],
                marketplaceState: MarketplaceState.SOLD,
                lastUpdated: { $gte: Utils.GetDaysSeconds(days) }
            };

            projects[0].collections.forEach(collection => {
                query.contractAddress.push(collection.contractAddress);
            });

            const tokensPerformanceResult = await this.collectionItemModel
                .find(query)
                .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits']);

            tokensPerformanceResult.forEach(f => {
                response.push(Converter.ConvertCollectionItem(f, false));
            });
        }
        return response;
    }

    async topSales(authToken?: string, days?: string) {
        const response = [];
        const projects = await this.generalApiService.getProjects();
        if (projects) {
            const query = {
                contractAddress: [],
                marketplaceState: MarketplaceState.SOLD,
                lastUpdated: { $gte: Utils.GetDaysSeconds(days) }
            };

            projects[0].collections.forEach(collection => {
                query.contractAddress.push(collection.contractAddress);
            });

            const topSaleResult = await this.collectionItemModel
                .find(query)
                .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])
                .limit(9)
                .sort([['price', -1], ['lastUpdated', 1]]);

            const favourites = [];
            if (authToken) {
                const userProfile = await this.authService.checkTokenAndGetProfile(authToken);
                const userFavourites = await this.favouriteService.getFavouriteCollectionItemsByUserProfile(userProfile);
                userFavourites.forEach(f => {
                    favourites.push(f.contractAddress + '_' + f.tokenId);
                });
            }

            topSaleResult.forEach(f => {
                response.push(Converter.ConvertCollectionItem(f, favourites.includes(f.contractAddress + '_' + f.tokenId)));
            });
        }
        return response;
    }

    async getCollectionItemsByOwner(authToken: string) {
        const userProfile = await this.authService.checkTokenAndGetProfile(authToken);

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

        if (userProfile.ethAddress && userProfile.ethAddress.length > 0) {
            const owner = userProfile.ethAddress.toLowerCase();
            const collectionItems = [];

            collectionItems.push(...(await this.collectionItemModel
                .find({
                    marketplaceState: MarketplaceState.LISTED,
                    seller: owner
                })
                .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])));

            collectionItems.push(...await this.collectionItemModel
                .find({
                    marketplaceState: MarketplaceState.NONE,
                    owner: owner
                })
                .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits']));

            const resultItems = this.convertCollectionItems(collectionItems.sort(function (a, b) { return b.collectionAddress - a.collectionAddress }), false);
            await this.fillCollectionItemsFavourites(resultItems, userProfile);

            resultItems.forEach(f => {
                switch (f.contractAddress) {
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
        }

        return result;
    }

    async getCollectionItem(authToken: string | undefined, address: string, tokenId: string) {
        const collectionItem = await this.collectionItemModel.findOne({
            contractAddress: address,
            tokenId,
            marketplaceState: {
                "$ne": MarketplaceState.SOLD
            }
        }).select(['-_id', '-__v', '-needUpdate']);

        let favourite = false;
        if (authToken) {
            const userProfile = await this.authService.checkTokenAndGetProfile(authToken);
            const userFavourites = await this.favouriteService.getFavouriteCollectionItemsByUserProfile(userProfile);
            favourite = userFavourites.filter(f => f.tokenId == collectionItem.tokenId).length > 0;
        }

        return Converter.ConvertCollectionItem(collectionItem, favourite);
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

    async fillCollectionItemsFavourites(collectionItems: any, userProfile: UserProfile & Document) {
        const userFavourites = await this.favouriteService.getFavouriteCollectionItemsByUserProfile(userProfile);
        const favouriteCollectionItems = new Set<string>();
        userFavourites.forEach(f => {
            favouriteCollectionItems.add(f.contractAddress + '_' + f.tokenId);
        });
        collectionItems.forEach(f => {
            if (favouriteCollectionItems.has(f.contractAddress + '_' + f.tokenId)) {
                f['favourite'] = true;
            } else {
                f['favourite'] = false;
            }
        });
    }

    private convertCollectionItems(collectionItems: any, swapSeller = false) {
        const resultItems = [];
        const resultIds = new Set<number>();

        collectionItems.forEach(r => {
            if (!resultIds.has(r.tokenId)) {
                const resultItem = Converter.ConvertCollectionItem(r, false);
                if (r.seller && swapSeller) {
                    resultItem.owner = r.seller;
                }
                resultItems.push(resultItem);
                resultIds.add(r.tokenId);
            } else {
                // Remove possible duplicates and prioritize listed one
                for (const resultItem of resultItems) {
                    if (resultItem.tokenId == r.tokenId && resultItem.marketplaceState == MarketplaceState.NONE && r.marketplaceState == MarketplaceState.LISTED) {
                        resultItem.marketplaceState = MarketplaceState.LISTED;
                    }
                }
            }
        });
        return resultItems;
    }

}