import { SharedLibraryService } from '@app/shared-library';
import { SectorContent } from '@app/shared-library/shared-library.main';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Island, IslandDocument } from './schemas/schema.island';
import { Sector, SectorDocument } from './schemas/schema.sector';
import { World, WorldDocument } from './schemas/schema.world';

@Injectable()
export class AppService {

  public static readonly WORLD_SIZE = 15;
  public static readonly BASE_POS_X = 5;
  public static readonly BASE_POS_Y = 5;

  private world: WorldDocument;

  constructor(
    @InjectModel(Sector.name) private sectorModel: Model<SectorDocument>,
    @InjectModel(World.name) private worldModel: Model<WorldDocument>,
    @InjectModel(Island.name) private islandModel: Model<IslandDocument>
  ) { }

  async onModuleInit() {
    const world = await this.findWorld();
    if (!world) {
      const newWorld = await this.createWorld();
      for (let x = 0; x < AppService.WORLD_SIZE; x++) {
        for (let y = 0; y < AppService.WORLD_SIZE; y++) {
          let content = SectorContent.EMPTY;
          if (x == AppService.BASE_POS_X && y == AppService.BASE_POS_Y) {
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
      this.world = await newWorld.save();
    } else {
      this.world = world;
    }
    // await this.mockIslands();
  }

  // -----------------------
  // World
  // -----------------------

  public generateNewIslandPosition() {
    const notEmptySectors = new Set<Number>(
      this.world.sectors
        .filter(sector => sector.content == SectorContent.EMPTY && !sector.locked)
        .map(sector => sector.positionId)
    );

    let x = 0;
    let y = 0;
    let emergencyBreakCount = AppService.WORLD_SIZE * AppService.WORLD_SIZE;

    while (true) {
      emergencyBreakCount--;
      if (emergencyBreakCount <= 0) {
        break;
      }

      x = SharedLibraryService.GetRandomIntInRange(0, 15);
      y = SharedLibraryService.GetRandomIntInRange(0, 15);

      if (!notEmptySectors.has(x + y)) {
        break;
      }
    }

    return {
      x, y
    }
  }

  public async findWorld() {
    return this.worldModel.findOne().populate('sectors');
  }

  private async createWorld() {
    const world = new this.worldModel();
    return await world.save();
  }

  private async invalidateWorld() {
    this.world = await this.findWorld();
  }

  // -----------------------
  // Sector
  // -----------------------

  private async createSector(x: number, y: number, sectorContent: SectorContent) {
    const sector = new this.sectorModel({
      positionId: x + y,
      x,
      y,
      content: sectorContent
    });
    return await sector.save();
  }

  private async findSectorByid(id: string) {
    return this.sectorModel.findOne({ _id: id }).populate('island');
  }

  private async lockSector(positionId: number) {
    const sector = await this.sectorModel.findOne({ positionId });
    if (sector) {
      sector.locked = true;
      await sector.save();
      await this.invalidateWorld();
    }
  }

}
