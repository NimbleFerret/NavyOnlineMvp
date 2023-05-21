import { SharedLibraryService } from "@app/shared-library";
import { EthersConstants } from "@app/shared-library/ethers/ethers.constants";
import { VenomConstants } from "@app/shared-library/venom/venom.constants";
import { Injectable } from "@nestjs/common";
import { DashboardDto } from "../dto/dto.dashboard";
import { CollectionApiService } from "./api.collection";

@Injectable()
export class DashboardApiService {

    constructor(private readonly collectionService: CollectionApiService) {
    }

    async dashboard(days?: string) {
        const result: DashboardDto = {
            venomPerformance: {
                chainId: SharedLibraryService.VENOM_CHAIN_ID,
                chainName: SharedLibraryService.VENOM_CHAIN_NAME,
                tokenSymbol: SharedLibraryService.VENOM_TOKEN_SYMBOL,
                tokenTurnover: 0,
                captainsSold: 0,
                islandsSold: 0,
                shipsSold: 0
            },
            cronosPerformance: {
                chainId: SharedLibraryService.CRONOS_CHAIN_ID,
                chainName: SharedLibraryService.CRONOS_CHAIN_NAME,
                tokenSymbol: SharedLibraryService.CRONOS_TOKEN_SYMBOL,
                tokenTurnover: 0,
                captainsSold: 0,
                islandsSold: 0,
                shipsSold: 0
            }
        };
        const collectionItemsSold = await this.collectionService.getLastCollectionItemsSold(days);

        if (collectionItemsSold) {
            collectionItemsSold.forEach(collectionItem => {
                if (collectionItem.chainName == SharedLibraryService.VENOM_CHAIN_NAME) {
                    if (VenomConstants.CaptainsCollectionContractAddress == collectionItem.contractAddress) {
                        result.venomPerformance.captainsSold++;
                    }
                    if (VenomConstants.ShipsCollectionContractAddress == collectionItem.contractAddress) {
                        result.venomPerformance.shipsSold++;
                    }
                    if (VenomConstants.IslandsCollectionContractAddress == collectionItem.contractAddress) {
                        result.venomPerformance.islandsSold++;
                    }
                    result.venomPerformance.tokenTurnover += collectionItem.price;
                } else {
                    if (EthersConstants.CaptainContractAddress == collectionItem.contractAddress) {
                        result.cronosPerformance.captainsSold++;
                    }
                    if (EthersConstants.ShipContractAddress == collectionItem.contractAddress) {
                        result.cronosPerformance.shipsSold++;
                    }
                    if (EthersConstants.IslandContractAddress == collectionItem.contractAddress) {
                        result.cronosPerformance.islandsSold++;
                    }
                    result.cronosPerformance.tokenTurnover += collectionItem.price;
                }
            });
        }

        return result;
    }

}