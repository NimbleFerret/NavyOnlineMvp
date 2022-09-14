/* eslint-disable prettier/prettier */
import { EvmChain } from '@moralisweb3/evm-utils';
import { Injectable, OnModuleInit } from '@nestjs/common';

import Moralis from "moralis";
import { CronosService } from 'src/cronos/cronos.service';

interface PlayerCaptainNFT {
    id: string;
    miningRewardNVY: string;
    stakingRewardNvy: string;
    traits: string;
    level: string;
    rarity: string;
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
    id: string;
    level: number;
    rarity: number;
    terrain: string;
    miningRewardNVY: number;
    shipAndCaptainFee: number;
    maxMiners: number;
    minersFee: number;
}

@Injectable()
export class MoralisService implements OnModuleInit {

    private readonly chain = EvmChain.CRONOS_TESTNET;


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
        const total = response.data.total
        if (total > 0) {
            for (const entity of response.data.result) {
                const metadataAttributes = JSON.parse(entity.metadata).attributes;
                const playerCaptainNft = {
                    id: entity.token_id,
                    miningRewardNVY: metadataAttributes[0]['miningRewardNVY'],
                    stakingRewardNvy: metadataAttributes[1]['stakingRewardNvy'],
                    traits: metadataAttributes[2]['traits'],
                    level: metadataAttributes[3]['level'],
                    rarity: metadataAttributes[4]['rarity'],
                } as PlayerCaptainNFT;
                result.push(playerCaptainNft);
            }
        }
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
                const metadataAttributes = JSON.parse(entity.metadata).attributes;
                const playerShipNft = {
                    id: entity.token_id,
                    hull: metadataAttributes[0]['hull'],
                    armor: metadataAttributes[1]['armor'],
                    maxSpeed: metadataAttributes[2]['maxSpeed'],
                    accelerationStep: metadataAttributes[3]['accelerationStep'],
                    accelerationDelay: metadataAttributes[4]['accelerationDelay'],
                    rotationDelay: metadataAttributes[5]['rotationDelay'],
                    cannons: metadataAttributes[6]['cannons'],
                    cannonsRange: metadataAttributes[7]['cannonsRange'],
                    cannonsDamage: metadataAttributes[8]['cannonsDamage'],
                    traits: metadataAttributes[9]['traits'],
                    rarity: metadataAttributes[10]['rarity'],
                    size: metadataAttributes[11]['size'],
                    windows: metadataAttributes[12]['windows'],
                    anchor: metadataAttributes[13]['anchor'],
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
        const total = response.data.total
        if (total > 0) {
            for (const entity of response.data.result) {
                const metadataAttributes = JSON.parse(entity.metadata).attributes;
                const playerIslandNFT = {
                    id: entity.token_id,
                    level: metadataAttributes[0]['level'],
                    rarity: metadataAttributes[1]['rarity'],
                    terrain: metadataAttributes[2]['terrain'],
                    miningRewardNVY: metadataAttributes[3]['miningRewardNVY'],
                    shipAndCaptainFee: metadataAttributes[4]['shipAndCaptainFee'],
                    maxMiners: metadataAttributes[5]['maxMiners'],
                    minersFee: metadataAttributes[6]['minersFee']
                } as PlayerIslandNFT;
                result.push(playerIslandNFT);
            }
        }
        return result;
    }
}
