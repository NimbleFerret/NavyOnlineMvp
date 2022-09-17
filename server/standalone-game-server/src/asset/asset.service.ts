/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Captain, CaptainDocument } from './asset.captain.entity';
import { Island, IslandDocument } from './asset.island.entity';
import { Ship, ShipDocument } from './asset.ship.entity';

@Injectable()
export class AssetService {

    constructor(
        @InjectModel(Captain.name) private CaptainModel: Model<CaptainDocument>,
        @InjectModel(Ship.name) private shipModel: Model<ShipDocument>,
        @InjectModel(Island.name) private islandModel: Model<IslandDocument>,
    ) {
    }

    public async findIslandByXAndY(x: number, y: number) {
        return this.islandModel.findOne({
            x, y
        });
    }

    public async createIsland(tokenId: string, owner: string, x: number, y: number, terrain: string, isBase = false) {
        const island = new this.islandModel();
        island.tokenId = tokenId;
        island.owner = owner;
        island.x = x;
        island.y = y;
        island.isBase = isBase;
        island.terrain = terrain;
        return island.save();
    }

}
