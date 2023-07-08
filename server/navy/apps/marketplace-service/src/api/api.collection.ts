import { SharedLibraryService } from "@app/shared-library";
import { CronosConstants } from "@app/shared-library/blockchain/cronos/cronos.constants";
import { VenomConstants } from "@app/shared-library/blockchain/venom/venom.constants";
import { Collection, CollectionDocument } from "@app/shared-library/schemas/marketplace/schema.collection";
import { CollectionItem, CollectionItemDocument, MarketplaceState } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { Mint, MintDocument } from "@app/shared-library/schemas/marketplace/schema.mint";
import { UserProfile } from "@app/shared-library/schemas/schema.user.profile";
import { Converter } from "@app/shared-library/shared-library.converter";
import { Utils } from "@app/shared-library/utils";
import { BadGatewayException, BadRequestException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Document } from "mongoose";
import { AppService } from "../app.service";
import { CollectionItemResponseObject, PaginatedCollectionItemsResponse } from "../dto/dto.collection";
import { TopSalesDto } from "../dto/dto.topSales";
import { AuthApiService } from "./api.auth";
import { FavouriteApiService } from "./api.favourite";
import { GeneralApiService } from "./api.general";

@Injectable()
export class CollectionApiService implements OnModuleInit {

    private collectionDisplayingNameByChainAndName = new Map<string, string>();
    private collectionDisplayingDescriptionByChainAndName = new Map<string, string>();

    constructor(
        private readonly generalApiService: GeneralApiService,
        private readonly favouriteService: FavouriteApiService,
        private readonly authService: AuthApiService,
        @InjectModel(Mint.name) private mintModel: Model<MintDocument>,
        @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
        @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>,
    ) {
    }

    async onModuleInit() {
        setTimeout(async () => {
            const cronosCaptainsCollection = await this.getCollection(SharedLibraryService.CRONOS_CHAIN_NAME, CronosConstants.CaptainContractAddress);
            const cronosShipsCollection = await this.getCollection(SharedLibraryService.CRONOS_CHAIN_NAME, CronosConstants.ShipContractAddress);
            const cronosIslandsCollection = await this.getCollection(SharedLibraryService.CRONOS_CHAIN_NAME, CronosConstants.IslandContractAddress);

            const venomCaptainsCollection = await this.getCollection(SharedLibraryService.VENOM_CHAIN_NAME, CronosConstants.CaptainContractAddress);
            const venomShipsCollection = await this.getCollection(SharedLibraryService.VENOM_CHAIN_NAME, CronosConstants.ShipContractAddress);
            const venomIslandsCollection = await this.getCollection(SharedLibraryService.VENOM_CHAIN_NAME, CronosConstants.IslandContractAddress);

            const cronosCaptainsKey = SharedLibraryService.CRONOS_CHAIN_NAME + '_' + SharedLibraryService.CAPTAINS_COLLECTION_NAME;
            const cronosShipsKey = SharedLibraryService.CRONOS_CHAIN_NAME + '_' + SharedLibraryService.SHIPS_COLLECTION_NAME;
            const cronosIslandsKey = SharedLibraryService.CRONOS_CHAIN_NAME + '_' + SharedLibraryService.ISLANDS_COLLECTION_NAME;

            const venomCaptainsKey = SharedLibraryService.VENOM_CHAIN_NAME + '_' + SharedLibraryService.CAPTAINS_COLLECTION_NAME;
            const venomShipsKey = SharedLibraryService.VENOM_CHAIN_NAME + '_' + SharedLibraryService.SHIPS_COLLECTION_NAME;
            const venomIslandsKey = SharedLibraryService.VENOM_CHAIN_NAME + '_' + SharedLibraryService.ISLANDS_COLLECTION_NAME;

            // Cronos
            this.collectionDisplayingNameByChainAndName.set(cronosCaptainsKey, cronosCaptainsCollection.name);
            this.collectionDisplayingDescriptionByChainAndName.set(cronosCaptainsKey, cronosCaptainsCollection.description);

            this.collectionDisplayingNameByChainAndName.set(cronosShipsKey, cronosShipsCollection.name);
            this.collectionDisplayingDescriptionByChainAndName.set(cronosShipsKey, cronosShipsCollection.description);

            this.collectionDisplayingNameByChainAndName.set(cronosIslandsKey, cronosIslandsCollection.name);
            this.collectionDisplayingDescriptionByChainAndName.set(cronosIslandsKey, cronosIslandsCollection.description);

            // Venom
            this.collectionDisplayingNameByChainAndName.set(venomCaptainsKey, venomCaptainsCollection.name);
            this.collectionDisplayingDescriptionByChainAndName.set(venomCaptainsKey, venomCaptainsCollection.description);

            this.collectionDisplayingNameByChainAndName.set(venomShipsKey, venomShipsCollection.name);
            this.collectionDisplayingDescriptionByChainAndName.set(venomShipsKey, venomShipsCollection.description);

            this.collectionDisplayingNameByChainAndName.set(venomIslandsKey, venomIslandsCollection.name);
            this.collectionDisplayingDescriptionByChainAndName.set(venomIslandsKey, venomIslandsCollection.description);
        }, 2500);
    }

    async getCollection(chainName: string, contractAddress: string) {
        chainName = chainName.charAt(0).toUpperCase() + chainName.slice(1);

        const collection = await this.collectionModel.findOne({ chainName, contractAddress }).select(['-_id', '-__v']);
        if (!collection) {
            throw new BadGatewayException();
        }
        return collection;
    }

    async getCollectionItems(
        authToken: string | undefined,
        chainName: string,
        contractAddress: string,
        page?: number,
        size?: number,
        priceOrder?: string,
        rarity?: string[],
        marketplaceState?: string
    ): Promise<PaginatedCollectionItemsResponse> {
        if (chainName == SharedLibraryService.CRONOS_CHAIN_NAME.toLowerCase()) {
            chainName = SharedLibraryService.CRONOS_CHAIN_NAME;
        } else if (chainName == SharedLibraryService.VENOM_CHAIN_NAME.toLowerCase()) {
            chainName = SharedLibraryService.VENOM_CHAIN_NAME;
        } else {
            throw new BadRequestException();
        }

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

        const listedQuery = {
            chainName,
            contractAddress: contractAddress.toLowerCase(),
            marketplaceState: MarketplaceState.LISTED
        };
        const notListedQuery = {
            chainName,
            contractAddress: contractAddress.toLowerCase(),
            marketplaceState: MarketplaceState.NONE
        };

        if (rarity && rarity.length > 0) {
            const rarityIn = [];

            if (rarity.includes('Legendary')) {
                rarityIn.push('Legendary');
            }
            if (rarity.includes('Epic')) {
                rarityIn.push('Epic');
            }
            if (rarity.includes('Rare')) {
                rarityIn.push('Rare');
            }
            if (rarity.includes('Common')) {
                rarityIn.push('Common');
            }

            if (rarityIn.length > 0) {
                listedQuery['rarity'] = { "$in": rarityIn };
                notListedQuery['rarity'] = { "$in": rarityIn };
            }
        }

        let loadListed = true;
        let loadNotListed = true;
        let listedCount = 0;
        let notListedCount = 0;
        const listedResult = [];
        const notListedResult = [];

        if (marketplaceState) {
            if (marketplaceState.toLowerCase() == MarketplaceState.LISTED.toLowerCase()) {
                loadNotListed = false;
            }
            if (marketplaceState.toLowerCase() == MarketplaceState.NONE.toLowerCase()) {
                loadListed = false;
            }
        }

        if (loadListed) {
            listedResult.push(...await this.collectionItemModel.find(listedQuery)
                .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])
                .skip((page - 1) * pageSize)
                .limit(pageSize));
            listedCount = await this.collectionItemModel.count(listedQuery);
        }
        if (loadNotListed) {
            notListedResult.push(...await this.collectionItemModel.find(notListedQuery)
                .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])
                .skip((page - 1) * pageSize)
                .limit(pageSize - listedCount));
            notListedCount = await this.collectionItemModel.count(notListedQuery);;
        }

        const totalCount = listedCount + notListedCount;

        // ----------------------------------
        // Query collection items
        // ----------------------------------

        const totalResult = [...listedResult, ...notListedResult]
            .sort(function (a, b) {
                const marketplaceStateCondition = a.marketplaceState.localeCompare(b.marketplaceState);
                let sortCondition = marketplaceStateCondition || b.tokenId - a.tokenId;

                if (priceOrder) {
                    if (priceOrder == 'asc') {
                        sortCondition = marketplaceStateCondition || b.price - a.price;
                    } else if (priceOrder == 'desc') {
                        sortCondition = marketplaceStateCondition || a.price - b.price;
                    }
                }

                return sortCondition;
            });

        const resultItems = this.convertCollectionItems(totalResult);

        if (userProfile) {
            await this.fillCollectionItemsFavourites(resultItems, userProfile);
        }

        // ----------------------------------
        // Prepare paginated response
        // ----------------------------------

        let pages = Math.ceil(totalCount / pageSize);
        let next = null;
        let prev = null;

        if (pages < 1) {
            pages = 1;
        }
        if (pages > 1) {
            const getUrl = (p: number) => {
                let url = '';
                url = `https://navy-metaverse.online/marketplace/collection/${chainName}/${contractAddress}/items?page=${p}`;
                if (size) {
                    url += '&size=' + size;
                }
                if (rarity) {
                    url += '&rarity=' + rarity;
                }
                if (priceOrder) {
                    url += '&priceOrder=' + priceOrder;
                }
                return url;
            };

            next = ((page - 1) * pageSize) + totalResult.length < (totalCount) ? getUrl(Number(initialPage) + 1) : null;
            prev = page > 1 ? getUrl(page - 1) : null;
        }

        let collectionName = '';
        let collectionDescription = '';

        if (totalResult.length > 0) {
            collectionName = this.collectionDisplayingNameByChainAndName.get(chainName + '_' + totalResult[0].collectionName);
            collectionDescription = this.collectionDisplayingDescriptionByChainAndName.get(chainName + '_' + totalResult[0].collectionName);
        }

        const response: PaginatedCollectionItemsResponse = {
            info: {
                count: totalCount,
                pages,
                next,
                prev,
                collectionName,
                collectionDescription
            },
            result: resultItems
        };

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

    async getLastCollectionItemsSold(days?: string) {
        const response: CollectionItemResponseObject[] = [];
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

    async topSales(chainName: string, authToken?: string, days?: string) {
        const response: TopSalesDto = {};

        if (chainName == 'all') {
            response.cronosTopSales = [];
            response.venomTopSales = [];
        } else if (chainName == SharedLibraryService.VENOM_CHAIN_NAME.toLowerCase()) {
            response.venomTopSales = [];
        } else if (chainName == SharedLibraryService.CRONOS_CHAIN_NAME.toLowerCase()) {
            response.cronosTopSales = [];
        }

        const topSalesCount = 9;

        const projects = await this.generalApiService.getProjects();
        if (projects) {
            const self = this;
            async function getTopSalesByChainName(chainName: string) {
                const query = {
                    chainName,
                    contractAddress: [],
                    marketplaceState: MarketplaceState.SOLD,
                    lastUpdated: { $gte: Utils.GetDaysSeconds(days) }
                };

                projects[0].collections.forEach(collection => {
                    query.contractAddress.push(collection.contractAddress);
                });

                const topSaleResult = await self.collectionItemModel
                    .find(query)
                    .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])
                    .limit(topSalesCount)
                    .sort([['price', -1], ['lastUpdated', 1]]);

                return topSaleResult;
            }

            const favourites = [];
            if (authToken) {
                const userProfile = await this.authService.checkTokenAndGetProfile(authToken);
                const userFavourites = await this.favouriteService.getFavouriteCollectionItemsByUserProfile(userProfile);
                userFavourites.forEach(f => {
                    favourites.push(f.contractAddress + '_' + f.tokenId);
                });
            }

            let venomTopSales = [];
            let cronosTopSales = [];

            if (chainName == 'all') {
                venomTopSales = await getTopSalesByChainName(SharedLibraryService.VENOM_CHAIN_NAME);
                cronosTopSales = await getTopSalesByChainName(SharedLibraryService.CRONOS_CHAIN_NAME);

                venomTopSales.forEach(f => {
                    response.venomTopSales.push(Converter.ConvertCollectionItem(f, favourites.includes(f.contractAddress + '_' + f.tokenId)));
                });
                cronosTopSales.forEach(f => {
                    response.cronosTopSales.push(Converter.ConvertCollectionItem(f, favourites.includes(f.contractAddress + '_' + f.tokenId)));
                });
            } else if (chainName == SharedLibraryService.VENOM_CHAIN_NAME.toLowerCase()) {
                venomTopSales = await getTopSalesByChainName(SharedLibraryService.VENOM_CHAIN_NAME);

                venomTopSales.forEach(f => {
                    response.venomTopSales.push(Converter.ConvertCollectionItem(f, favourites.includes(f.contractAddress + '_' + f.tokenId)));
                });
            } else if (chainName == SharedLibraryService.CRONOS_CHAIN_NAME.toLowerCase()) {
                cronosTopSales = await getTopSalesByChainName(SharedLibraryService.CRONOS_CHAIN_NAME);

                cronosTopSales.forEach(f => {
                    response.cronosTopSales.push(Converter.ConvertCollectionItem(f, favourites.includes(f.contractAddress + '_' + f.tokenId)));
                });
            }
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
                    owner: owner
                })
                .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])));

            collectionItems.push(...await this.collectionItemModel
                .find({
                    marketplaceState: MarketplaceState.NONE,
                    owner: owner
                })
                .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits']));

            const resultItems = this.convertCollectionItems(collectionItems.sort(function (a, b) { return b.collectionAddress - a.collectionAddress }));
            await this.fillCollectionItemsFavourites(resultItems, userProfile);

            resultItems.forEach(f => {
                switch (f.contractAddress) {
                    case VenomConstants.CaptainsCollectionContractAddress:
                    case CronosConstants.CaptainContractAddress:
                        result.captains.total++;
                        result.captains.items.push(f);
                        break;
                    case VenomConstants.ShipsCollectionContractAddress:
                    case CronosConstants.ShipContractAddress:
                        result.ships.total++;
                        result.ships.items.push(f);
                        break;
                    case VenomConstants.IslandsCollectionContractAddress:
                    case CronosConstants.IslandContractAddress:
                        result.islands.total++;
                        result.islands.items.push(f);
                        break;
                }
            });
        }

        return result;
    }

    async getCollectionItem(authToken: string | undefined, chainName: string, address: string, tokenId: string) {
        if (chainName == SharedLibraryService.CRONOS_CHAIN_NAME.toLowerCase()) {
            chainName = SharedLibraryService.CRONOS_CHAIN_NAME;
        } else if (chainName == SharedLibraryService.VENOM_CHAIN_NAME.toLowerCase()) {
            chainName = SharedLibraryService.VENOM_CHAIN_NAME;
        } else {
            throw new BadRequestException();
        }

        const collectionItems = await this.collectionItemModel.find({
            contractAddress: address,
            tokenId,
            chainName,
            marketplaceState: {
                "$ne": MarketplaceState.SOLD
            }
        }).select(['-_id', '-__v', '-needUpdate']);

        if (collectionItems.length == 0) {
            throw new NotFoundException();
        }

        let collectionItem = collectionItems[0];
        if (collectionItems.length == 2) {
            const listedItems = collectionItems.filter(f => f.marketplaceState == MarketplaceState.LISTED);
            if (listedItems && listedItems.length > 0) {
                collectionItem = listedItems[0];
            }
        }

        let favourite = false;
        if (authToken) {
            const userProfile = await this.authService.checkTokenAndGetProfile(authToken);
            const userFavourites = await this.favouriteService.getFavouriteCollectionItemsByUserProfile(userProfile);
            favourite = userFavourites.filter(f => f.tokenId == collectionItem.tokenId).length > 0;
        }

        return Converter.ConvertCollectionItem(collectionItem, favourite);
    }

    async getMintByCollection(chainName: string, collectionAddress: string) {
        chainName = chainName.charAt(0).toUpperCase() + chainName.slice(1);
        const collection = await this.getCollection(chainName, collectionAddress);
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

    private convertCollectionItems(collectionItems: any) {
        const resultItems = [];
        const resultIds = new Set<number>();

        collectionItems.forEach(r => {
            if (!resultIds.has(r.tokenId)) {
                const resultItem = Converter.ConvertCollectionItem(r, false);
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