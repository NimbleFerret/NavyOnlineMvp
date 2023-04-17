import { EthersConstants } from "@app/shared-library/ethers/ethers.constants";
import { CollectionItem, CollectionItemDocument } from "@app/shared-library/schemas/marketplace/schema.collection.item";
import { MarketplaceNftsType } from "@app/shared-library/workers/workers.marketplace";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GeneralApiService } from "./api.general";

@Injectable()
export class DashboardApiService implements OnModuleInit {

    constructor(
        @InjectModel(CollectionItem.name) private collectionItemModel: Model<CollectionItemDocument>,
        private readonly generalApiService: GeneralApiService
    ) {

    }

    onModuleInit() {
        throw new Error("Method not implemented.");
    }

    async dashboard(days?: string) {
        const topSales = await this.topSales(days);

        let cronosTotal = 0;
        let captainsSold = 0;
        let islandsSold = 0;
        let shipsSold = 0;

        if (topSales) {
            topSales.forEach(sale => {
                cronosTotal += Number(sale.price);

                if (EthersConstants.CaptainContractAddress == sale.contractAddress) {
                    captainsSold++;
                }
                if (EthersConstants.ShipContractAddress == sale.contractAddress) {
                    shipsSold++;
                }
                if (EthersConstants.IslandContractAddress == sale.contractAddress) {
                    islandsSold++;
                }
            });
        }

        return {
            tokenPerformance: {
                chainId: 25,
                chainName: 'Cronos',
                coinSymbol: 'CRO',
                performance: cronosTotal
            },
            captainsSold,
            islandsSold,
            shipsSold
        }
    }

    async topSales(days?: string) {
        const response = [];
        const projects = await this.generalApiService.getProjects();
        if (projects) {
            const query = {
                contractAddress: [],
                marketplaceNftsType: MarketplaceNftsType.SOLD,
                lastUpdated: { $gte: this.getDaysSeconds(days) }
            };
            projects[0].collections.forEach(collection => {
                query.contractAddress.push(collection.contractAddress);
            });
            const topSaleResult = await this.collectionItemModel
                .find(query)
                .select(['-_id', '-__v', '-id', '-needUpdate', '-visuals', '-traits'])
                .limit(9)
                .sort([['price', -1], ['lastUpdated', 1]]);
            topSaleResult.forEach(f => {
                response.push({
                    tokenId: f.tokenId,
                    tokenUri: f.tokenUri,
                    seller: f.seller,
                    owner: f.owner,
                    price: f.price,
                    image: f.image,
                    rarity: f.rarity,
                    lastUpdated: f.lastUpdated,
                    contractAddress: f.contractAddress,
                    chainId: f.chainId,
                    marketplaceState: f.marketplaceState,
                    chainName: 'Cronos',
                    coinSymbol: 'CRO',
                    showPrice: true
                });
            });
            return response;
        }
    }

    private getDaysSeconds(days?: string) {
        const nowTimeSeconds = Number(Number(Date.now() / 1000).toFixed(0));
        const daySeconds = 24 * 60 * 60;
        let seconds = nowTimeSeconds;
        if (days) {
            if (days == '7') {
                seconds = nowTimeSeconds - (daySeconds * 7);
            } else if (days == '30') {
                seconds = nowTimeSeconds - (daySeconds * 30);
            } else {
                seconds = nowTimeSeconds - daySeconds;
            }
        }
        return seconds;
    }
}