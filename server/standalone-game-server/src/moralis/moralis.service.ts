/* eslint-disable prettier/prettier */
import { EvmChain } from '@moralisweb3/evm-utils';
import { Injectable, OnModuleInit } from '@nestjs/common';

import Moralis from "moralis";
import { CronosService } from 'src/cronos/cronos.service';
import { PlayerShipEntity, ShipType } from 'src/shipyard/shipyard.ship.entity';

export interface PlayerCaptainNFT {
    id: string;
    miningRewardNVY: string;
    stakingRewardNVY: string;
    traits: string;
    level: string;
    rarity: string;
    bg: number;
    acc: number;
    head: number;
    haircutOrHat: number;
    clothes: number;
}

export interface PlayerIslandNFT {
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
    private readonly apiKey = "aQrAItXuznpPv1pEXAgPIIwcVqwaehaPHpB9WmGo0eP1dGUdmzyt5SYfmstQslBF";

    async onModuleInit() {
        await Moralis.start({
            apiKey: this.apiKey
        });
    }

    async loadUserNFTs(address: string) {
        const captains = await this.getCaptainNFTsByOwnerAddress(address) as PlayerCaptainNFT[];
        const ships = await this.getShipNFTsByOwnerAddress(address) as PlayerShipEntity[];
        const islands = await this.getIslandNFTsByOwnerAddress(address) as PlayerIslandNFT[];
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
                    stakingRewardNVY: metadataAttributes[1]['stakingRewardNVY'],
                    traits: metadataAttributes[2]['traits'],
                    level: metadataAttributes[3]['level'],
                    rarity: metadataAttributes[4]['rarity'],
                    bg: metadataAttributes[5]['bg'],
                    acc: metadataAttributes[6]['acc'],
                    head: metadataAttributes[7]['head'],
                    haircutOrHat: metadataAttributes[8]['haircutOrHat'],
                    clothes: metadataAttributes[9]['clothes'],
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
                    type: ShipType.COMMON,
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
                    level: metadataAttributes[10]['level'],
                    rarity: metadataAttributes[11]['rarity'],
                    size: metadataAttributes[12]['size'],
                    windows: metadataAttributes[13]['windows'],
                    anchor: metadataAttributes[14]['anchor'],
                } as PlayerShipEntity;
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
