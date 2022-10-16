import { SharedLibraryService } from '@app/shared-library';
import { SectorContent, SectorInfo, WorldMoveRequest } from '@app/shared-library/gprc/grpc.world.service';
import { Sector, SectorDocument } from '@app/shared-library/schemas/schema.sector';
import { WorldDocument, World } from '@app/shared-library/schemas/schema.world';
import { IslandDocument, Island } from '@app/shared-library/schemas/schema.island';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppService {

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
      for (let x = 0; x < SharedLibraryService.WORLD_SIZE; x++) {
        for (let y = 0; y < SharedLibraryService.WORLD_SIZE; y++) {
          let content = SectorContent.SECTOR_CONTENT_EMPTY;
          if (x == SharedLibraryService.BASE_POS_X && y == SharedLibraryService.BASE_POS_Y) {
            content = SectorContent.SECTOR_CONTENT_BASE;
          }
          if ((x == 7 && y == 2) || (x == 2 && y == 10) || (x == 10 && y == 8)) {
            content = SectorContent.SECTOR_CONTENT_PVE;
          }
          if ((x == 2 && y == 2) || (x == 9 && y == 9)) {
            content = SectorContent.SECTOR_CONTENT_BOSS;
          }
          if ((x == 12 && y == 12) || (x == 10 && y == 15) || (x == 13 && y == 14)) {
            content = SectorContent.SECTOR_CONTENT_PVP;
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

  async mockIslands() {

  }

  // -----------------------
  // World
  // -----------------------

  public async generateNewIslandPosition() {
    const emptySectors = new Set<String>(
      this.world.sectors
        .filter(sector => sector.content == SectorContent.SECTOR_CONTENT_EMPTY && !sector.locked)
        .map(sector => sector.positionId)
    );

    let x = 0;
    let y = 0;
    let success = true;
    let emergencyBreakCount = SharedLibraryService.WORLD_SIZE * SharedLibraryService.WORLD_SIZE;

    while (true) {
      emergencyBreakCount--;
      if (emergencyBreakCount <= 0) {
        success = false;
        break;
      }

      x = SharedLibraryService.GetRandomIntInRange(0, SharedLibraryService.WORLD_SIZE - 1);
      y = SharedLibraryService.GetRandomIntInRange(0, SharedLibraryService.WORLD_SIZE - 1);

      if (emptySectors.has(x + '/' + y)) {
        break;
      }
    }

    if (success) {
      await this.lockSector(x + '/' + y);
    }

    return {
      x,
      y,
      success
    }
  }

  public async getWorldInfo() {
    let sectors: SectorInfo[];
    sectors = this.world.sectors.map(sector => {
      return {
        x: sector.x,
        y: sector.y,
        sectorContent: sector.content
      }
    })
    return {
      sectors
    }
  }

  public async worldMove(quest: WorldMoveRequest) {

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
      positionId: x + '/' + y,
      x,
      y,
      content: sectorContent
    });
    return await sector.save();
  }

  private async findSectorByid(id: string) {
    return this.sectorModel.findOne({ _id: id }).populate('island');
  }

  private async lockSector(positionId: string) {
    console.log('Locking sector:' + positionId);
    const sector = await this.sectorModel.findOne({ positionId });
    if (sector) {
      sector.locked = true;
      await sector.save();
      await this.invalidateWorld();
    }
  }

}
