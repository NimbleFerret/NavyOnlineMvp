import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SharedLibraryService } from '@app/shared-library';
import {
  AddNewIslandToSectorRequest,
  SectorContent,
  SectorInfoRequest,
  SectorInfoResponse,
  WorldMoveRequest
} from '@app/shared-library/gprc/grpc.world.service';
import { Sector, SectorDocument } from '@app/shared-library/schemas/schema.sector';
import { WorldDocument, World } from '@app/shared-library/schemas/schema.world';
import { IslandDocument, Island } from '@app/shared-library/schemas/schema.island';
import { UserProfile, UserProfileDocument } from '@app/shared-library/schemas/schema.user.profile';

@Injectable()
export class AppService {

  constructor(
    @InjectModel(Sector.name) private sectorModel: Model<SectorDocument>,
    @InjectModel(World.name) private worldModel: Model<WorldDocument>,
    @InjectModel(Island.name) private islandModel: Model<IslandDocument>,
    @InjectModel(UserProfile.name) private userProfileModel: Model<UserProfileDocument>
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
      await newWorld.save();
    }
  }

  async mockIslands() {

  }

  // -----------------------
  // World
  // -----------------------

  public async generateNewIslandPosition() {
    const world = await this.findWorld();

    const emptySectors = new Set<String>(
      world.sectors
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
    const world = await this.findWorld();
    const sectors = world.sectors.map(sector => {
      return {
        x: sector.x,
        y: sector.y,
        sectorContent: sector.content
      }
    });
    return {
      sectors
    }
  }

  public async getSectorInfo(request: SectorInfoRequest) {
    const sector = await this.sectorModel.findOne({
      positionId: request.x + '/' + request.y
    });
    return {
      sector: {
        x: sector.x,
        y: sector.y,
        sectorContent: sector.content
      }
    } as SectorInfoResponse;
  }

  public async worldMove(request: WorldMoveRequest) {
    let success = false;
    const user = await this.userProfileModel.findOne({
      ethAddress: request.user
    });
    // if (user && request.x <= SharedLibraryService.WORLD_SIZE && request.y <= SharedLibraryService.WORLD_SIZE) {
    //   const x = Math.abs(user.worldX - request.x);
    //   const y = Math.abs(user.worldY - request.y);
    //   if (x <= 1 && y <= 1) {
    //     user.worldX = request.x;
    //     user.worldY = request.y;
    //     await user.save();
    //     success = true;
    //   }
    // }
    return {
      success
    }
  }

  public async addNewIslandToSector(request: AddNewIslandToSectorRequest) {
    const island = await this.islandModel.findOne({
      tokenId: request.tokenId
    });
    if (island) {
      const sector = await this.sectorModel.findOne({
        positionId: island.x + '/' + island.y
      });
      if (sector) {
        sector.content = SectorContent.SECTOR_CONTENT_ISLAND;
        sector.island = island;
        await sector.save();
      } else {
        console.log('No such sector error');
      }
    } else {
      console.log('No such island');
    }
  }

  public async findWorld() {
    return this.worldModel.findOne().populate('sectors');
  }

  private async createWorld() {
    const world = new this.worldModel();
    return await world.save();
  }

  // -----------------------
  // Island
  // -----------------------

  private async createIsland() {

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
    const sector = await this.sectorModel.findOne({ positionId });
    if (sector) {
      sector.locked = true;
      await sector.save();
    }
  }

}
