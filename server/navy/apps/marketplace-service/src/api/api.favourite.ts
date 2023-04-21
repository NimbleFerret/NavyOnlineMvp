import { CollectionItem, CollectionItemDocument } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { Favourite, FavouriteDocument } from "@app/shared-library/schemas/marketplace/schema.favourite";
import { UserProfile, UserProfileDocument } from "@app/shared-library/schemas/schema.user.profile";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FavouriteDto } from "../dto/dto.favourite";

@Injectable()
export class FavouriteApiService {

    constructor(
        @InjectModel(UserProfile.name) private userProfileModel: Model<UserProfileDocument>,
        @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>,
        @InjectModel(Favourite.name) private favouriteModel: Model<FavouriteDocument>,) {
    }

    async favoutires(authToken: string) {
        const userProfile = await this.getUserProfileByAuthToken(authToken);
        if (userProfile) {
            const favourites = await this.favouriteModel.find({ userProfile });
            const collectionItems = favourites.map(f => {
                return f.collectionItem;
            });
            return await this.collectionItemModel
                .find({ '_id': { $in: collectionItems } })
                .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])
                .sort([['marketplaceState', 1], ['tokenId', -1]]);;
        } else {
            throw new HttpException('Bad auth', HttpStatus.UNAUTHORIZED);
        }
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
        const userProfile = await this.getUserProfileByAuthToken(authToken);
        if (userProfile) {
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
        } else {
            throw new HttpException('Bad auth', HttpStatus.UNAUTHORIZED);
        }
    }

    private async getCollectionItemById(dto: FavouriteDto) {
        return await this.collectionItemModel.findOne({
            contractAddress: dto.contractAddress,
            tokenId: dto.tokenId
        });
    }

    private async getUserProfileByAuthToken(authToken: string) {
        return await this.userProfileModel.findOne({
            authToken
        });
    }
}