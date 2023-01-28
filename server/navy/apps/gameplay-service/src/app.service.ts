import { Config } from '@app/shared-library/config';
import {
  GameplayBalancerService,
  GameplayBalancerServiceGrpcClientName,
  GameplayBalancerServiceName
} from '@app/shared-library/gprc/grpc.gameplay-balancer.service';
import { UserService, UserServiceGrpcClientName, UserServiceName } from '@app/shared-library/gprc/grpc.user.service';
import { SectorContent, WorldService, WorldServiceGrpcClientName, WorldServiceName } from '@app/shared-library/gprc/grpc.world.service';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';
import { CreateOrJoinGameRequestDto } from './app.dto';
import { GameplayBattleService } from './gameplay/battle/gameplay.battle.service';
import { JoinWorldOrCreateResult } from './gameplay/gameplay.base.service';
import { GameplayIslandService } from './gameplay/island/gameplay.island.service';

@Injectable()
export class AppService implements OnModuleInit {

  public static SERVICE_PORT = Config.GAMEPLAY_SERVICE_DEFAULT_PORT;
  public static SERVICE_REGION = Config.GAMEPLAY_SERVICE_DEFAULT_REGION;

  private address = 'localhost:' + AppService.SERVICE_PORT;

  private worldService: WorldService;
  private userService: UserService;
  private gameplayBalancerService: GameplayBalancerService;

  constructor(
    @Inject(WorldServiceGrpcClientName) private readonly worldServiceGrpcClient: ClientGrpc,
    @Inject(UserServiceGrpcClientName) private readonly userServiceGrpcClient: ClientGrpc,
    @Inject(GameplayBalancerServiceGrpcClientName) private readonly gameplayBalancerServiceGrpcClient: ClientGrpc,
    private readonly gameplayBattleService: GameplayBattleService,
    private readonly gameplayIslandService: GameplayIslandService,
  ) {
    // const ip = require('ip');
    // console.log(ip.address());
  }

  async onModuleInit() {
    this.worldService = this.worldServiceGrpcClient.getService<WorldService>(WorldServiceName);
    this.userService = this.userServiceGrpcClient.getService<UserService>(UserServiceName);
    this.gameplayBalancerService = this.gameplayBalancerServiceGrpcClient.getService<GameplayBalancerService>(GameplayBalancerServiceName);
  }

  @Cron(CronExpression.EVERY_SECOND)
  balancerPing() {
    this.gameplayBalancerService.GameplayServicePing({
      address: this.address,
      region: AppService.SERVICE_REGION,
      battleInstances: this.gameplayBattleService.getInstancesInfo(),
      islandInstances: this.gameplayIslandService.getInstancesInfo(),
    }).subscribe();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  destroyEmptyInstances() {
    this.gameplayBattleService.destroyEmptyInstancesIfNeeded();
    this.gameplayIslandService.destroyEmptyInstancesIfNeeded();
  }

  async createOrJoinGame(dto: CreateOrJoinGameRequestDto) {
    Logger.log('CreateOrJoinGame request. User address:' + dto.user);

    const userPos = await lastValueFrom(this.userService.GetUserPos({
      user: dto.user
    }));
    const sectorInfo = await lastValueFrom(this.worldService.GetSectorInfo({
      x: userPos.x,
      y: userPos.y
    }));

    let joinResult: JoinWorldOrCreateResult;

    switch (sectorInfo.sector.sectorContent) {
      case SectorContent.SECTOR_CONTENT_EMPTY:
      case SectorContent.SECTOR_CONTENT_BOSS:
      case SectorContent.SECTOR_CONTENT_PVE:
      case SectorContent.SECTOR_CONTENT_PVP:
        console.log('Book a new battle instance');
        joinResult = this.gameplayBattleService.joinWorldOrCreate(sectorInfo.sector.x, sectorInfo.sector.y, sectorInfo.sector.sectorContent);
        break;
      case SectorContent.SECTOR_CONTENT_BASE:
      case SectorContent.SECTOR_CONTENT_ISLAND:
        console.log('Book a new island instance');
        joinResult = this.gameplayIslandService.joinWorldOrCreate(sectorInfo.sector.x, sectorInfo.sector.y, sectorInfo.sector.sectorContent);
        break;
    }

    return joinResult
  }


}
