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
import { RandomService } from 'src/random/random.service';
import { Island, IslandDocument } from 'src/asset/asset.island.entity';

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

  private static world: WorldDocument;
  private static worldModel: Model<WorldDocument>
  private static userModel: Model<UserDocument>

  constructor(
    private gameplayBattleService: GameplayBattleService,
    private gameplayIslandService: GameplayIslandService,
    @InjectModel(Sector.name) private sectorModel: Model<SectorDocument>,
    @InjectModel(World.name) private worldModel: Model<WorldDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Island.name) private islandModel: Model<IslandDocument>
  ) {
    WorldService.worldModel = worldModel;
    WorldService.userModel = userModel;
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
          const sector = await this.createSector(x, y, content);

          // if (content == SectorContent.BASE) {
          //   const baseIsland = await AssetService.saveNewIsland(uuidv4(), Rarity.LEGENDARY, 'ADMIN', x, y, 'Green', true);
          //   sector.island = baseIsland;
          //   sector = await sector.save();
          // }
          newWorld.sectors.push(sector);
        }
      }
      WorldService.world = await newWorld.save();
    } else {
      WorldService.world = world;
    }
    // await this.mockIslands();
  }

  public static async addNewIslandToSector(island: IslandDocument) {
    const world = await WorldService.worldModel.findOne().populate('sectors');
    for (let sector of world.sectors) {
      if (sector.x == island.x && sector.y == island.y) {

        sector.island = island;
        sector.content = SectorContent.ISLAND;
        sector = await sector.save();

        WorldService.world = await WorldService.world.save();

        const user = await this.findUserByEthAddress(island.owner);
        if (user.islandsOwned) {
          user.islandsOwned.push(island);
        } else {
          user.islandsOwned = [island];
        }
        await user.save();

        break;
      }
    }
  }

  public async joinSector(x: number, y: number) {
    const result: JoinSectorResponse = {
      result: false
    };
    const world = await this.findWorld();
    for (const sector of world.sectors) {
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
              const island = await this.islandModel.findOne({
                tokenId: populatedSector.island.tokenId
              });

              result.islandId = island.tokenId;
              result.islandOwner = island.owner;
              result.islandTerrain = island.terrain;
              result.islandMining = island.mining;
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

  public async generateNewIslandPosition() {
    const world = await this.findWorld();
    const notEmptySectors = new Set<string>();

    world.sectors.forEach(sector => {
      if (sector.content != SectorContent.EMPTY) {
        notEmptySectors.add(String(sector.x + sector.y));
      }
    });

    let x = 0;
    let y = 0;
    let emergencyBreakCount = 220;

    while (true) {
      emergencyBreakCount--;
      if (emergencyBreakCount <= 0) {
        break;
      }

      x = RandomService.GetRandomIntInRange(0, 15);
      y = RandomService.GetRandomIntInRange(0, 15);

      if (!notEmptySectors.has(String(x + y))) {
        break;
      }
    }

    return {
      x, y
    }
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

  public async findWorld() {
    return this.worldModel.findOne().populate('sectors');
  }

  private async findSector(id: string) {
    return this.sectorModel.findOne({ _id: id }).populate('island');
  }

  private static async findUserByEthAddress(ethAddress: string) {
    return await WorldService.userModel.findOne({
      ethAddress
    });
  }
}
