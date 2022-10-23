import { Config } from '@app/shared-library/config';
import {
  GameplayBalancerService,
  GameplayBalancerServiceGrpcClientName,
  GameplayBalancerServiceName
} from '@app/shared-library/gprc/grpc.gameplay-balancer.service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService implements OnModuleInit {

  public static SERVICE_PORT = Config.GAMEPLAY_SERVICE_DEFAULT_PORT;
  public static SERVICE_REGION = Config.GAMEPLAY_SERVICE_DEFAULT_REGION;

  private address = 'localhost:' + AppService.SERVICE_PORT;
  private gameplayBalancerService: GameplayBalancerService;

  constructor(
    @Inject(GameplayBalancerServiceGrpcClientName) private readonly gameplayBalancerServiceGrpcClient: ClientGrpc,
  ) {
    // const ip = require('ip');
    // console.log(ip.address());
  }

  async onModuleInit() {
    this.gameplayBalancerService = this.gameplayBalancerServiceGrpcClient.getService<GameplayBalancerService>(GameplayBalancerServiceName);
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  balancerPing() {
    // this.gameplayBalancerService.GameplayServicePing({
    //   address: this.address,
    //   region: AppService.SERVICE_REGION,
    //   battleInstances: 0,
    //   islandInstances: 0,
    //   battlePlayers: 0,
    //   islandPlayers: 0
    // }).subscribe();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
