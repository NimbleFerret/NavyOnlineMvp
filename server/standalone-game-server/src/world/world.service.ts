/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Sector, SectorDocument } from './sector.entity';
import { World, WorldDocument } from './world.entity';
import { SectorContent } from 'src/ws/ws.protocol';
import { GameplayIslandService } from 'src/gameplay/island/gameplay.island.service';
import { GameplayBattleService } from 'src/gameplay/battle/gameplay.battle.service';
import { User, UserDocument } from 'src/user/user.entity';
import { AssetService } from 'src/asset/asset.service';
import { Rarity } from 'src/random/random.entity';

export interface SectorInfo {
  x: number;
  y: number;
  content: SectorContent;
}

export interface WorldInfo {
  size: number;
  sectors: SectorInfo[];
}

// HTTP responses

export interface JoinSectorResponse {
  // Common
  result: boolean;
  reason?: string;
  instanceId?: string;
  sectorType?: number;

  // Island info
  islandId?: string;
  islandOwner?: string;
  islandTerrain?: string;
  islandMining?: boolean;

  // Battle info
  totalShips?: number;
}

@Injectable()
export class WorldService implements OnModuleInit {

  public static readonly WORLD_SIZE = 15;
  public static readonly BASE_POS_X = 5;
  public static readonly BASE_POS_Y = 5;

  private world: WorldDocument;

  constructor(
    private assetService: AssetService,
    private gameplayBattleService: GameplayBattleService,
    private gameplayIslandService: GameplayIslandService,
    @InjectModel(Sector.name) private sectorModel: Model<SectorDocument>,
    @InjectModel(World.name) private worldModel: Model<WorldDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
  }

  async onModuleInit() {
    const world = await this.findWorld();
    if (!world) {
      const newWorld = await this.createWorld();
      for (let x = 0; x < WorldService.WORLD_SIZE; x++) {
        for (let y = 0; y < WorldService.WORLD_SIZE; y++) {
          let content = SectorContent.EMPTY;
          if (x == WorldService.BASE_POS_X && y == WorldService.BASE_POS_Y) {
            content = SectorContent.BASE;
          }
          if ((x == 7 && y == 2) || (x == 2 && y == 10) || (x == 10 && y == 8)) {
            content = SectorContent.PVE;
          }
          if ((x == 2 && y == 2) || (x == 9 && y == 9)) {
            content = SectorContent.BOSS;
          }
          if ((x == 12 && y == 12) || (x == 10 && y == 15) || (x == 13 && y == 14)) {
            content = SectorContent.PVP;
          }
          let sector = await this.createSector(x, y, content);

          if (content == SectorContent.BASE) {
            const baseIsland = await this.assetService.createIsland(uuidv4(), Rarity.LEGENDARY, 'ADMIN', x, y, 'Green', true);
            sector.island = baseIsland;
            sector = await sector.save();
          }
          newWorld.sectors.push(sector);
        }
      }
      this.world = await newWorld.save();
    } else {
      this.world = world;
    }
    await this.mockIslands();
  }

  public async mockIslands() {
    const mockedUserAddress = '0x87400A03678dd03c8BF536404B5B14C609a23b79';
    const user = await this.findUserByEthAddress(mockedUserAddress);

    if (user) {
      const mockedSector1X = 1;
      const mockedSector1Y = 3;

      const mockedSector2X = 5;
      const mockedSector2Y = 7;

      const mockedSector3X = 4;
      const mockedSector3Y = 5;

      let hasMockedSectors = false;

      for (const sector of this.world.sectors) {
        if (sector.x == mockedSector1X && sector.y == mockedSector1Y && sector.content != SectorContent.EMPTY) {
          hasMockedSectors = true;
          break;
        }
      }

      if (!hasMockedSectors) {
        const island1 = await this.assetService.createIsland(uuidv4(), Rarity.LEGENDARY, mockedUserAddress, mockedSector1X, mockedSector1Y, 'Green');
        const island2 = await this.assetService.createIsland(uuidv4(), Rarity.LEGENDARY, mockedUserAddress, mockedSector2X, mockedSector2Y, 'Dark');
        const island3 = await this.assetService.createIsland(uuidv4(), Rarity.LEGENDARY, mockedUserAddress, mockedSector3X, mockedSector3Y, 'Snow');

        for (let sector of this.world.sectors) {
          if (sector.x == mockedSector1X && sector.y == mockedSector1Y) {
            sector.content = SectorContent.ISLAND;
            sector.island = island1;
            sector = await sector.save();
          }
          if (sector.x == mockedSector2X && sector.y == mockedSector2Y) {
            sector.content = SectorContent.ISLAND;
            sector.island = island2;
            sector = await sector.save();
          }
          if (sector.x == mockedSector3X && sector.y == mockedSector3Y) {
            sector.content = SectorContent.ISLAND;
            sector.island = island3;
            sector = await sector.save();
          }
        }

        this.world = await this.world.save();

        user.islandsOwned = [island1, island2, island3];
        await user.save();
      }
    }
  }

  public async joinSector(x: number, y: number) {
    const result: JoinSectorResponse = {
      result: false
    };
    for (const sector of this.world.sectors) {
      if (sector.x == x && sector.y == y) {
        switch (sector.content) {
          case SectorContent.BASE:
          case SectorContent.ISLAND: {
            const joinResult = this.gameplayIslandService.joinWorldOrCreate(x, y, sector.content);
            result.result = joinResult.result;

            if (!result.result) {
              result.reason = joinResult.reason;
            } else {
              result.instanceId = joinResult.instanceId;
              result.sectorType = sector.content;

              const populatedSector = await this.findSector(sector.id);

              result.islandId = populatedSector.island.tokenId;
              result.islandOwner = populatedSector.island.owner;
              result.islandTerrain = populatedSector.island.terrain;
              result.islandMining = populatedSector.island.mining;
            }
            break;
          }
          case SectorContent.EMPTY:
          case SectorContent.BOSS:
          case SectorContent.PVE:
          case SectorContent.PVP:
            const joinResult = this.gameplayBattleService.joinWorldOrCreate(x, y, sector.content);
            result.result = joinResult.result;

            if (!result.result) {
              result.reason = joinResult.reason;
            } else {
              // TODO add total ships info ?
              result.instanceId = joinResult.instanceId;
              result.sectorType = sector.content;
            }
        }
        break;
      }
    }
    return result;
  }

  public async getWorldInfo() {
    const world = await this.findWorld();
    const result = {
      size: WorldService.WORLD_SIZE,
      sectors: []
    } as WorldInfo;
    world.sectors.forEach(sector => {
      if (sector.content != SectorContent.EMPTY) {
        result.sectors.push({
          x: sector.x,
          y: sector.y,
          content: sector.content
        });
      }
    });
    return result;
  }

  private async createSector(x: number, y: number, sectorContent: SectorContent) {
    const sector = new this.sectorModel({
      x,
      y,
      content: sectorContent
    });
    return await sector.save();
  }

  private async createWorld() {
    const world = new this.worldModel();
    return await world.save();
  }

  private async findWorld() {
    return this.worldModel.findOne().populate('sectors');
  }

  private async findSector(id: string) {
    return this.sectorModel.findOne({ _id: id }).populate('island');
  }

  async findUserByEthAddress(ethAddress: string) {
    return await this.userModel.findOne({
      ethAddress
    });
  }
}
