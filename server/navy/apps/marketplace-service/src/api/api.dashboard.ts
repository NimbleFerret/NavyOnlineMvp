import { EthersConstants } from "@app/shared-library/ethers/ethers.constants";
import { Injectable } from "@nestjs/common";
import { CollectionApiService } from "./api.collection";

@Injectable()
export class DashboardApiService {

    constructor(private readonly collectionService: CollectionApiService) {
    }

    async dashboard(days?: string) {
        const topSales = await this.collectionService.tokensPerformance(days);

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

}