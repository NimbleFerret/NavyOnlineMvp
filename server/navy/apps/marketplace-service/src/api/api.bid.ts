import { Bid, BidDocument } from "@app/shared-library/schemas/marketplace/schema.bid";
import { Collection, CollectionDocument } from "@app/shared-library/schemas/marketplace/schema.collection";
import { CollectionItem, CollectionItemDocument } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { BadGatewayException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BidPlaceDto, BidDeleteDto } from "../dto/dto.bids";

@Injectable()
export class BidApiService {

    constructor(
        @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
        @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
        @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>) {
    }

    async bidPlace(dto: BidPlaceDto) {
        const contractAddress = dto.contractAddress;
        const tokenId = dto.tokenId;

        // Check if such collection and token exists
        if (await this.collectionModel.findOne({ contractAddress }) &&
            await this.collectionItemModel.findOne({ contractAddress, tokenId })) {
            // Check if there is no the same bid
            if (!await this.bidModel.findOne({
                contractAddress,
                tokenId,
                price: { $gte: dto.price }
            })) {
                const bid = new this.bidModel();
                bid.contractAddress = dto.contractAddress;
                bid.tokenId = dto.tokenId;
                bid.price = dto.price;
                bid.bidInitiatorAddress = dto.bidInitiatorAddress;
                const newBid = await bid.save();
                return {
                    bidId: newBid.id
                }
            } else {
                throw new BadGatewayException('Ubale to place a bid');
            }
        } else {
            throw new BadGatewayException('No such collection or token');
        }
    }

    async bidDelete(dto: BidDeleteDto) {
        const bid = await this.bidModel.deleteOne({ id: dto.bidId });
        if (bid) {
            return {
                success: true
            }
        } else {
            return {
                success: false
            }
        }
    }

    async bids(contractAddress: string, tokenId: string) {
        return await this.bidModel.find({
            contractAddress,
            tokenId
        }).select(['-_id', '-__v']);
    }
}