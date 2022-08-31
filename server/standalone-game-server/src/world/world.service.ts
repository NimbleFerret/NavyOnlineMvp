/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Sector, SectorContent, SectorDocument } from './sector.entity';
import { World, WorldDocument } from './world.entity';
import { GameService } from 'src/game/game.service';

export interface SectorInfo {
  x: number;
  y: number;
  content: SectorContent;
}

export interface WorldInfo {
  size: number;
  sectors: SectorInfo[];
}

export interface JoinSector {
  result: boolean;
  reason?: string;
  playersCount?: number;
  totalShips?: number;
  instanceId?: string;
}

@Injectable()
export class WorldService implements OnModuleInit {

  public static readonly WORLD_SIZE = 15;
  public static readonly BASE_POS_X = 5;
  public static readonly BASE_POS_Y = 5;

  private world: World;

  constructor(
    private gameService: GameService,
    @InjectModel(Sector.name) private sectorModel: Model<SectorDocument>,
    @InjectModel(World.name) private worldModel: Model<WorldDocument>
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
          if ((x == 1 && y == 3) || (x == 5 && y == 7)) {
            content = SectorContent.ISLAND;
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
          newWorld.sectors.push(sector);
        }
      }
      this.world = await newWorld.save();
    } else {
      this.world = world;
    }
  }

  public async joinSector(x: number, y: number) {
    const result: JoinSector = {
      result: false
    };

    this.world.sectors.forEach(sector => {
      if (sector.x == x && sector.y == y) {
        switch (sector.content) {
          case SectorContent.BASE: {
            // TODO get base params
            break;
          }
          case SectorContent.ISLAND: {
            // TODO get island params
            break;
          }
          case SectorContent.EMPTY:
          case SectorContent.BOSS:
          case SectorContent.PVE:
          case SectorContent.PVP:
            const joinResult = this.gameService.joinWorldOrCreate(x, y, sector.content);
            result.result = joinResult.result;

            if (!result.result) {
              result.reason = joinResult.reason;
            } else {
              result.instanceId = joinResult.instanceId;
              result.playersCount = joinResult.playersCount;
              result.totalShips = joinResult.totalShips;
            }
        }
      }
    });

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
    return sector.save();
  }

  private async createWorld() {
    const world = new this.worldModel();
    return world.save();
  }

  private async findWorld() {
    return this.worldModel.findOne().populate('sectors');
  }
}
