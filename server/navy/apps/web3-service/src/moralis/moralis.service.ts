import Moralis from "moralis";
import { EvmChain } from '@moralisweb3/evm-utils';
import { ethers } from 'ethers';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Constants } from "../app.constants";
import { CaptainEntity } from "@app/shared-library/entities/entity.captain";
import { IslandEntity } from "@app/shared-library/entities/entity.island";
import { ShipEntity } from "@app/shared-library/entities/entity.ship";
import { AssetType } from "@app/shared-library/shared-library.main";

@Injectable()
export class MoralisService implements OnModuleInit {

    private readonly chain = EvmChain.CRONOS_TESTNET;
    private readonly apiKey = "aQrAItXuznpPv1pEXAgPIIwcVqwaehaPHpB9WmGo0eP1dGUdmzyt5SYfmstQslBF";

    async onModuleInit() {
        await Moralis.start({
            apiKey: this.apiKey
        });
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

    async loadUserTokenBalances(address: string) {
        let nvy = 0;
        let aks = 0;

        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            address,
            chain: this.chain,
        }) as any;

        response.data.forEach(f => {
            if (f.token_address == Constants.NvyContractAddress) {
                nvy = Number(ethers.utils.formatEther(f.balance));
            }
            if (f.token_address == Constants.AksContractAddress) {
                aks = Number(ethers.utils.formatEther(f.balance));
            }
        });

        return {
            nvy, aks
        }
    }

    async loadUserNFTs(address: string) {
        const captains: CaptainEntity[] = [];
        const ships: ShipEntity[] = [];
        const islands: IslandEntity[] = [];

        const response = await Moralis.EvmApi.nft.getWalletNFTs({
            address,
            chain: this.chain,
            tokenAddresses: [
                Constants.CaptainContractAddress,
                Constants.ShipContractAddress,
                Constants.IslandContractAddress
            ]
        }) as any;

        const total = response.data.total

        if (total > 0) {
            for (const entity of response.data.result) {
                switch (entity.token_address) {
                    case Constants.CaptainContractAddress: {
                        captains.push(this.getCaptainNFTsByOwnerAddress(entity));
                        break;
                    }
                    case Constants.ShipContractAddress: {
                        ships.push(this.getShipNFTsByOwnerAddress(entity));
                        break;
                    }
                    case Constants.IslandContractAddress: {
                        islands.push(this.getIslandNFTsByOwnerAddress(entity));
                        break;
                    }
                }
            }
        }

        return {
            captains,
            ships,
            islands
        }
    }

    private getCaptainNFTsByOwnerAddress(entity: any) {
        const metadataAttributes = JSON.parse(entity.metadata).attributes;
        const playerCaptainEntity = {
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
        } as CaptainEntity;
        return playerCaptainEntity;
    }

    private getShipNFTsByOwnerAddress(entity: any) {
        const metadataAttributes = JSON.parse(entity.metadata).attributes;
        const playerShipEntity = {
            id: entity.token_id,
            type: AssetType.COMMON,
            hull: metadataAttributes[0]['hull'],
            armor: metadataAttributes[1]['armor'],
            maxSpeed: metadataAttributes[2]['maxSpeed'],
            accelerationStep: metadataAttributes[3]['accelerationStep'],
            accelerationDelay: metadataAttributes[4]['accelerationDelay'],
            rotationDelay: metadataAttributes[5]['rotationDelay'],
            fireDelay: metadataAttributes[6]['fireDelay'],
            cannons: metadataAttributes[7]['cannons'],
            cannonsRange: metadataAttributes[8]['cannonsRange'],
            cannonsDamage: metadataAttributes[9]['cannonsDamage'],
            traits: metadataAttributes[10]['traits'],
            level: metadataAttributes[11]['level'],
            rarity: metadataAttributes[12]['rarity'],
            size: metadataAttributes[13]['size'],
            currentIntegrity: metadataAttributes[14]['currentIntegrity'],
            maxIntegrity: metadataAttributes[15]['maxIntegrity'],
            windows: metadataAttributes[16]['windows'],
            anchor: metadataAttributes[17]['anchor'],
        } as ShipEntity;
        return playerShipEntity;
    }

    private getIslandNFTsByOwnerAddress(entity: any) {
        const metadataAttributes = JSON.parse(entity.metadata).attributes;
        const playerIslandEntity = {
            id: entity.token_id,
            level: metadataAttributes[0]['level'],
            rarity: metadataAttributes[1]['rarity'],
            terrain: metadataAttributes[2]['terrain'],
            miningRewardNVY: metadataAttributes[3]['miningRewardNVY'],
            shipAndCaptainFee: metadataAttributes[4]['shipAndCaptainFee'],
            maxMiners: metadataAttributes[5]['maxMiners'],
            minersFee: metadataAttributes[6]['minersFee'],
            x: metadataAttributes[7]['x'],
            y: metadataAttributes[8]['y']
        } as IslandEntity;
        return playerIslandEntity;
    }
}