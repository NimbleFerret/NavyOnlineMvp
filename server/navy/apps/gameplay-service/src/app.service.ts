import { Config } from '@app/shared-library/config';
import {
  GameplayBalancerService,
  GameplayBalancerServiceGrpcClientName,
  GameplayBalancerServiceName
} from '@app/shared-library/gprc/grpc.gameplay-balancer.service';
import { UserService, UserServiceGrpcClientName, UserServiceName } from '@app/shared-library/gprc/grpc.user.service';
import { SectorContent, WorldService, WorldServiceGrpcClientName, WorldServiceName } from '@app/shared-library/gprc/grpc.world.service';
import { MetricsService } from '@app/shared-library/metrics/metrics.service';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientGrpc } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';
import { Constants } from './app.constants';
import {
  AddBotRequestDto,
  AddInstanceRequestDto,
  CreateOrJoinGameRequestDto,
  EnableFeatureRequestDto,
  KillBotsRequestDto,
  KillInstanceRequestDto
} from './app.dto';
import { AppEvents, PlayerDisconnectedEvent } from './app.events';
import { GameplayBattleService } from './gameplay/battle/gameplay.battle.service';
import { GameplayBaseService, GameplayType, JoinWorldOrCreateResult } from './gameplay/gameplay.base.service';
import { GameplayIslandService } from './gameplay/island/gameplay.island.service';
import {
  SocketClientMessageJoinGame,
  SocketClientMessageInput,
  SocketClientMessageSync,
  SocketClientMessageRespawn
} from './ws/ws.protocol';

@Injectable()
export class AppService implements OnModuleInit {

  public static SERVICE_PORT = Config.GAMEPLAY_SERVICE_DEFAULT_PORT;
  public static SERVICE_REGION = Config.GAMEPLAY_SERVICE_DEFAULT_REGION;

  private readonly address = 'localhost:' + AppService.SERVICE_PORT;

  private worldService: WorldService;
  private userService: UserService;
  private gameplayBalancerService: GameplayBalancerService;

  private readonly instanceTypeById = new Map<string, GameplayType>();
  private readonly playerInstanceMap = new Map<string, string>();

  constructor(
    @Inject(WorldServiceGrpcClientName) private readonly worldServiceGrpcClient: ClientGrpc,
    @Inject(UserServiceGrpcClientName) private readonly userServiceGrpcClient: ClientGrpc,
    @Inject(GameplayBalancerServiceGrpcClientName) private readonly gameplayBalancerServiceGrpcClient: ClientGrpc,
    private readonly gameplayBattleService: GameplayBattleService,
    private readonly gameplayIslandService: GameplayIslandService,
    private readonly metricsService: MetricsService,
  ) {
    metricsService.registerGauge('instances', 'Total game instances');
    metricsService.registerGauge('main_entities', 'Entities across all instances');
    metricsService.registerGauge('max_loop_time', 'Average loop time across all instances');
  }

  async onModuleInit() {
    this.worldService = this.worldServiceGrpcClient.getService<WorldService>(WorldServiceName);
    this.userService = this.userServiceGrpcClient.getService<UserService>(UserServiceName);
    this.gameplayBalancerService = this.gameplayBalancerServiceGrpcClient.getService<GameplayBalancerService>(GameplayBalancerServiceName);

    if (Constants.HAS_TEST_INSTANCES) {
      this.gameplayBattleService.createTestInstance(SectorContent.SECTOR_CONTENT_EMPTY, true);
      this.gameplayIslandService.createTestInstance(SectorContent.SECTOR_CONTENT_ISLAND, false);
    }

    this.gameplayBattleService.instances.forEach(instance => {
      this.instanceTypeById.set(instance.instanceId, GameplayType.Battle);
    });
    this.gameplayIslandService.instances.forEach(instance => {
      this.instanceTypeById.set(instance.instanceId, GameplayType.Island);
    });
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  recurentJobs() {
    if (Constants.PING_BALANCER) {
      this.gameplayBalancerService.GameplayServicePing({
        address: this.address,
        region: AppService.SERVICE_REGION,
        battleInstances: this.gameplayBattleService.getInstancesInfo(),
        islandInstances: this.gameplayIslandService.getInstancesInfo()
      }).subscribe();
    }

    this.gameplayBattleService.destroyEmptyInstancesIfNeeded().forEach(instanceId => {
      this.instanceTypeById.delete(instanceId);
    });

    this.gameplayIslandService.destroyEmptyInstancesIfNeeded().forEach(instanceId => {
      this.instanceTypeById.delete(instanceId);
    });

    // update metrics
    // this.metricsService.setGaugeValue('instances', this.gameplayBattleService.getInstancesCount());
    // this.metricsService.setGaugeValue('main_entities', this.gameplayBattleService.getEntitiesCount());
    // this.metricsService.setGaugeValue('max_loop_time', this.gameplayBattleService.getMaxLoopTime());
  }

  // -------------------------------
  // API
  // -------------------------------

  getInstancesInfo() {
    return {
      battleInstances: this.gameplayBattleService.getInstancesInfo(),
      islandInstances: this.gameplayIslandService.getInstancesInfo(),
    }
  }

  async enableShooting(dto: EnableFeatureRequestDto) {
    this.gameplayBattleService.enableShooting(dto);
  }

  async enableCollisions(dto: EnableFeatureRequestDto) {
    this.gameplayBattleService.enableCollisions(dto);
  }

  async addInstance(dto: AddInstanceRequestDto) {
    const instanceId = this.gameplayBattleService.createTestInstance(SectorContent.SECTOR_CONTENT_EMPTY, false);
    for (let i = 0; i < dto.bots; i++) {
      await this.addBot({ instanceId });
    }
  }

  async addBot(dto: AddBotRequestDto) {
    this.gameplayBattleService.addBot(dto);
  }

  async killBots(dto: KillBotsRequestDto) {
    this.gameplayBattleService.killBots(dto);
  }

  async killInstance(dto: KillInstanceRequestDto) {
    this.gameplayBattleService.killInstance(dto.instanceId);
  }

  async createOrJoinGame(dto: CreateOrJoinGameRequestDto) {
    Logger.log('CreateOrJoinGame request. User address:' + dto.user);

    // TODO mock this
    const userPos = await lastValueFrom(this.userService.GetUserPos({
      user: dto.user
    }));
    const sectorInfo = await lastValueFrom(this.worldService.GetSectorInfo({
      x: userPos.x,
      y: userPos.y
    }));

    let gameplayService: GameplayBaseService;

    switch (sectorInfo.sector.sectorContent) {
      case SectorContent.SECTOR_CONTENT_EMPTY:
      case SectorContent.SECTOR_CONTENT_BOSS:
      case SectorContent.SECTOR_CONTENT_PVE:
      case SectorContent.SECTOR_CONTENT_PVP:
        Logger.log('Book a new battle instance');
        gameplayService = this.gameplayBattleService;
        break;
      case SectorContent.SECTOR_CONTENT_BASE:
      case SectorContent.SECTOR_CONTENT_ISLAND:
        Logger.log('Book a new island instance');
        gameplayService = this.gameplayIslandService;
        break;
    }

    return gameplayService.joinWorldOrCreate(sectorInfo.sector.x, sectorInfo.sector.y, sectorInfo.sector.sectorContent) as JoinWorldOrCreateResult;
  }

  // -------------------------------------
  // Client events from WebSocket
  // ------------------------------------- 

  @OnEvent(AppEvents.PlayerJoinedInstance)
  async handlePlayerJoinedEvent(data: SocketClientMessageJoinGame) {
    if (this.instanceTypeById.size > 0) {
      const playerId = data.playerId.toLowerCase();
      const instance = this.getInstanceById(data.instanceId);
      if (instance) {
        await instance.handlePlayerJoinedEvent(data);
        this.playerInstanceMap.set(playerId, data.instanceId);
        Logger.log(`Player: ${playerId} was added to the existing instance: ${data.instanceId}`);
      } else {
        Logger.error(`Unable to add player into any game instance, player id: ${playerId}, instance id: ${data.instanceId}`);
      }
    } else {
      Logger.error(`Player can't join more than once`);
    }
  }

  @OnEvent(AppEvents.PlayerDisconnected)
  async handlePlayerDisconnected(data: PlayerDisconnectedEvent) {
    const playerId = data.playerId.toLowerCase();
    const instance = this.getInstanceByPlayerId(playerId);
    if (instance) {
      this.playerInstanceMap.delete(playerId);
      instance.handlePlayerDisconnected(data);
      if (instance.getPlayersCount() == 0 && instance.destroy()) {
        Logger.log(`No more players in instance: ${instance.instanceId}, destroying...`);
        const gameplayService = this.getGameplayServiceByInstanceId(instance.instanceId);
        if (gameplayService) {
          gameplayService.instances.delete(instance.instanceId);
          gameplayService.sectorInstance.delete(instance.x + '+' + instance.y);
          Logger.log(`Instance: ${instance.instanceId} destroyed !`);
        } else {
          Logger.error(`Unable to delete instance, can't find gameplayService by id: ${instance.instanceId}`);
        }
      }
    } else {
      Logger.error(`Unable to handlePlayerDisconnected, can't find an instance by player id:${playerId}`);
    }
  }

  @OnEvent(AppEvents.PlayerInput)
  async handlePlayerInput(data: SocketClientMessageInput) {
    const instance = this.getInstanceByPlayerId(data.playerId.toLowerCase());
    if (instance) {
      await instance.handlePlayerInput(data);
    } else {
      Logger.error(`Unable to handlePlayerInput, can't find an instance by player id:${data.playerId.toLowerCase()}`);
    }
  }

  @OnEvent(AppEvents.PlayerSync)
  async handlePlayerSync(data: SocketClientMessageSync) {
    const instance = this.getInstanceByPlayerId(data.playerId.toLowerCase());
    if (instance) {
      instance.handlePlayerSync(data);
    } else {
      Logger.error(`Unable to handlePlayerSync, can't find an instance by player id:${data.playerId.toLowerCase()}`);
    }
  }

  @OnEvent(AppEvents.PlayerRespawn)
  async handlePlayerRespawn(data: SocketClientMessageRespawn) {
    // const instanceId = this.playerInstanceMap.get(data.playerId);
    // if (instanceId) {
    //   const gameInstance = this.instances.get(instanceId) as GameplayBattleInstance;
    //   gameInstance.handlePlayerRespawn(data);
    // }
  }

  // -------------------------------------
  // General
  // ------------------------------------- 

  getGameplayServiceByInstanceId(instanceId: string) {
    if (this.instanceTypeById.get(instanceId) == GameplayType.Battle) {
      return this.gameplayBattleService;
    } else if (this.instanceTypeById.get(instanceId) == GameplayType.Island) {
      return this.gameplayIslandService;
    }
  }

  getInstanceById(instanceId: string) {
    if (this.gameplayBattleService.hasInstance(instanceId)) {
      return this.gameplayBattleService.instances.get(instanceId);
    } else if (this.gameplayIslandService.hasInstance(instanceId)) {
      return this.gameplayIslandService.instances.get(instanceId);
    }
  }

  getInstanceByPlayerId(playerId: string) {
    const instanceId = this.playerInstanceMap.get(playerId);
    if (instanceId) {
      const instance = this.getInstanceById(instanceId);
      if (instance) {
        return instance;
      } else {
        Logger.error('Unable to get instance by instance id: ' + instanceId);
      }
    } else {
      Logger.error('Unable to get instance by player id: ' + playerId);
    }
  }

}