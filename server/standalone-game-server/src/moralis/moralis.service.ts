/* eslint-disable prettier/prettier */
import { EvmChain } from '@moralisweb3/evm-utils';
import { Injectable, OnModuleInit } from '@nestjs/common';

import Moralis from "moralis";
import { CronosService } from 'src/cronos/cronos.service';

interface PlayerCaptainNFT {
    id: string,
}

interface PlayerShipNFT {
    id: string,
    armor: number;
    hull: number;
    maxSpeed: number;
    accelerationStep: number;
    accelerationDelay: number;
    rotationDelay: number;
    cannons: number;
    cannonsRange: number;
    cannonsDamage: number;
    level: number;
    traits: number;
    size: number;
    rarity: number;
    windows: number;
    anchor: number;
}

interface PlayerIslandNFT {
    id: string,
}

@Injectable()
export class MoralisService implements OnModuleInit {


    async onModuleInit() {
        await Moralis.start({
            apiKey: this.apiKey
        });
    }

    async loadUserNFTs(address: string) {
        const captains = await this.getCaptainNFTsByOwnerAddress(address);
        const ships = await this.getShipNFTsByOwnerAddress(address);
        const islands = await this.getIslandNFTsByOwnerAddress(address);
        return {
            captains,
            ships,
            islands
        }
    }

    public static async UploadFile(path: string, content: string) {
        const abi = [
            {
                path,
                content
            }
        ];
        return await Moralis.EvmApi.ipfs.uploadFolder({
            abi
        });
    }

    private async getCaptainNFTsByOwnerAddress(address: string) {
        const result = [];
        const response = await Moralis.EvmApi.nft.getWalletNFTs({
            address,
            chain: this.chain,
            tokenAddresses: [CronosService.CaptainContractAddress]
        }) as any;
        return result;
    }

    private async getShipNFTsByOwnerAddress(address: string) {
        const result = [];
        const response = await Moralis.EvmApi.nft.getWalletNFTs({
            address,
            chain: this.chain,
            tokenAddresses: [CronosService.ShipContractAddress]
        }) as any;
        const total = response.data.total
        if (total > 0) {
            for (const entity of response.data.result) {
                const shipMetadataAttributes = JSON.parse(entity.metadata).attributes;
                const playerShipNft = {
                    id: entity.token_id,
                    hull: shipMetadataAttributes[0]['hull'],
                    armor: shipMetadataAttributes[1]['armor'],
                    maxSpeed: shipMetadataAttributes[2]['maxSpeed'],
                    accelerationStep: shipMetadataAttributes[3]['accelerationStep'],
                    accelerationDelay: shipMetadataAttributes[4]['accelerationDelay'],
                    rotationDelay: shipMetadataAttributes[5]['rotationDelay'],
                    cannons: shipMetadataAttributes[6]['cannons'],
                    cannonsRange: shipMetadataAttributes[7]['cannonsRange'],
                    cannonsDamage: shipMetadataAttributes[8]['cannonsDamage'],
                    traits: shipMetadataAttributes[9]['traits'],
                    rarity: shipMetadataAttributes[10]['rarity'],
                    size: shipMetadataAttributes[11]['size'],
                    windows: shipMetadataAttributes[12]['windows'],
                    anchor: shipMetadataAttributes[13]['anchor'],
                    // TODO add level here
                    // level: shipMetadataAttributes['level'],
                } as PlayerShipNFT;
                result.push(playerShipNft);
            }
        }
        return result;
    }

    private async getIslandNFTsByOwnerAddress(address: string) {
        const result = [];
        const response = await Moralis.EvmApi.nft.getWalletNFTs({
            address,
            chain: this.chain,
            tokenAddresses: [CronosService.IslandContractAddress]
        }) as any;
        return result;
    }
}
