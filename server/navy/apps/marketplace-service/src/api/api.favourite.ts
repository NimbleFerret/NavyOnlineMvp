import { CollectionItem, CollectionItemDocument, MarketplaceState } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { Favourite, FavouriteDocument } from "@app/shared-library/schemas/marketplace/schema.favourite";
import { UserProfile } from "@app/shared-library/schemas/schema.user.profile";
import { Converter } from "@app/shared-library/shared-library.converter";
import { Utils } from "@app/shared-library/utils";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Document } from "mongoose";
import { FavouriteDto } from "../dto/dto.favourite";
import { AuthApiService } from "./api.auth";

@Injectable()
export class FavouriteApiService {

    constructor(
        private readonly authService: AuthApiService,
        @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>,
        @InjectModel(Favourite.name) private favouriteModel: Model<FavouriteDocument>) {
    }

    async getFavoutireNftByUserProfile(userProfile: UserProfile & Document) {
        const favourites = await this.favouriteModel.find({ userProfile });
        return favourites.map(f => {
            return f.collectionItem;
        });
    }

    async getFavoutireNftIdsByAuthToken(authToken: string) {
        const userProfile = await this.authService.checkTokenAndGetProfile(authToken);
        return await this.getFavoutireNftIdsByUserProfile(userProfile);
    }

    async getFavoutireNftIdsByUserProfile(userProfile: UserProfile & Document) {
        const favs = await this.getFavoutireNftByUserProfile(userProfile);
        const collectionItemIds = [];
        for (const fav of favs) {
            const collectionItem = await this.collectionItemModel.findById(fav);
            collectionItemIds.push(collectionItem.tokenId);
        }
        return collectionItemIds;
    }

    async favouritesAdd(authToken: string, dto: FavouriteDto) {
        const favouriteResult = await this.findFavourite(authToken, dto);
        if (!favouriteResult.favourite) {
            const newFavouriteItem = new this.favouriteModel();
            newFavouriteItem.userProfile = favouriteResult.userProfile;
            newFavouriteItem.collectionItem = favouriteResult.collectionItem;
            await newFavouriteItem.save();
            const collectionItem = Converter.ConvertCollectionItem(favouriteResult.collectionItem, true);
            return collectionItem;
        } else {
            throw new HttpException({
                success: false,
                reason: Utils.ERROR_ALREADY_FAVOURITE
            }, HttpStatus.BAD_GATEWAY);
        }
    }

    async favouritesRemove(authToken: string, dto: FavouriteDto) {
        const favouriteResult = await this.findFavourite(authToken, dto);
        if (favouriteResult.favourite) {
            await favouriteResult.favourite.delete();
        } else {
            throw new HttpException({
                success: false,
                reason: Utils.ERROR_NOT_A_FAVOURITE
            }, HttpStatus.BAD_GATEWAY);
        }
    }

    private async findFavourite(authToken: string, dto: FavouriteDto) {
        const userProfile = await this.authService.checkTokenAndGetProfile(authToken);
        const collectionItem = await this.getCollectionItemById(dto);
        if (collectionItem) {
            const favourite = await this.favouriteModel.findOne({ collectionItem });
            return {
                userProfile,
                favourite,
                collectionItem
            }
        } else {
            throw new HttpException({
                success: false,
                reason: Utils.ERROR_BAD_SIGNATURE
            }, HttpStatus.BAD_REQUEST);
        }
    }

    private async getCollectionItemById(dto: FavouriteDto) {
        return await this.collectionItemModel.findOne({
            contractAddress: dto.contractAddress,
            tokenId: dto.tokenId,
            marketplaceState: {
                "$ne": MarketplaceState.SOLD
            }
        });
    }

}