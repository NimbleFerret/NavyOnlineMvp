/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AssetService } from './asset/asset.service';
import { CronosService } from './cronos/cronos.service';
import { MoralisService } from './moralis/moralis.service';
import { UserService } from './user/user.service';
import { WorldService } from './world/world.service';

export class SignInOrUpDto {
    ethAddress: string;
}

export class WorldMoveDto {
    ethAddress: string;
    x: number;
    y: number;
}

export class WorldEnterDto {
    ethAddress: string;
    x: number;
    y: number;
}

export class StartMiningDto {
    ethAddress: string;
    islandId: string;
}

@Controller('app')
export class AppController {

    constructor(
        private readonly userService: UserService,
        private readonly worldService: WorldService,
        private readonly cronosService: CronosService,
        private readonly moralisService: MoralisService,
        private readonly assetService: AssetService) {
    }

    // Users stuff

    @Post('signInOrUp')
    async signInOrUp(@Body() dto: SignInOrUpDto) {
        return await this.userService.signInOrUp(dto.ethAddress.toLowerCase());
    }

    @Get('world')
    async world() {
        return await this.worldService.getWorldInfo();
    }

    @Post('world/move')
    async worldMove(@Body() dto: WorldMoveDto) {
        return await this.userService.movePlayerAroundTheWorld(dto.ethAddress.toLowerCase(), dto.x, dto.y);
    }

    @Post('world/enter')
    async worldEnter(@Body() dto: WorldEnterDto) {
        if (this.userService.checkPlayerPos(dto.ethAddress.toLowerCase(), dto.x, dto.y)) {
            return this.worldService.joinSector(dto.x, dto.y);
        } else {
            return {
                result: false,
                reason: 'Bad position'
            }
        }
    }

    @Post('startMining')
    async startMining(@Body() dto: StartMiningDto) {
        await this.assetService.startMining(dto.islandId);
    }

    // Blockchain

    // Use cache here
    @Get('founders')
    async getFounderCollectionInfo() {
        return this.cronosService.getFounderCollectionsInfo();
    }

    @Get('nfts/:address')
    async loadUserNFTs(@Param('address') address: string) {
        const nftBasicInfo = await this.moralisService.loadUserNFTs(address.toLowerCase());
        return nftBasicInfo;
    }
}