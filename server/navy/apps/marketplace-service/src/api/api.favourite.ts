import { CollectionItem, CollectionItemDocument } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { Favourite, FavouriteDocument } from "@app/shared-library/schemas/marketplace/schema.favourite";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FavouriteDto } from "../dto/dto.favourite";
import { AuthApiService } from "./api.auth";

@Injectable()
export class FavouriteApiService {

    constructor(
        private readonly authService: AuthApiService,
        @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>,
        @InjectModel(Favourite.name) private favouriteModel: Model<FavouriteDocument>) {
    }

    async favoutires(authToken: string) {
        const userProfile = await this.authService.checkTokenAndGetProfile(authToken);
        const favourites = await this.favouriteModel.find({ userProfile });
        const collectionItems = favourites.map(f => {
            return f.collectionItem;
        });
        return await this.collectionItemModel
            .find({ '_id': { $in: collectionItems } })
            .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])
            .sort([['marketplaceState', 1], ['tokenId', -1]]);
    }

    async favouritesAdd(authToken: string, dto: FavouriteDto) {
        const favouriteResult = await this.findFavourite(authToken, dto);
        if (!favouriteResult.favourite) {
            const newFavouriteItem = new this.favouriteModel();
            newFavouriteItem.userProfile = favouriteResult.userProfile;
            newFavouriteItem.collectionItem = favouriteResult.collectionItem;
            newFavouriteItem.save();
        } else {
            throw new HttpException('Already favourite', HttpStatus.BAD_GATEWAY);
        }
    }

    async favouritesRemove(authToken: string, dto: FavouriteDto) {
        const favouriteResult = await this.findFavourite(authToken, dto);
        if (favouriteResult.favourite) {
            await favouriteResult.favourite.delete();
        } else {
            throw new HttpException('Item is not a favourite', HttpStatus.BAD_GATEWAY);
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
            throw new HttpException('No such collection item', HttpStatus.BAD_GATEWAY);
        }
    }

    private async getCollectionItemById(dto: FavouriteDto) {
        return await this.collectionItemModel.findOne({
            contractAddress: dto.contractAddress,
            tokenId: dto.tokenId
        });
    }

}