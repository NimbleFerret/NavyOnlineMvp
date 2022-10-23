import {
  GameplayBalancerServiceName,
  GameplayServicePingRequest,
  GetGameplayInstanceRequest
} from '@app/shared-library/gprc/grpc.gameplay-balancer.service';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @GrpcMethod(GameplayBalancerServiceName)
  gameplayServicePing(request: GameplayServicePingRequest) {
    this.appService.gameplayServicePing(request);
  }

  @GrpcMethod(GameplayBalancerServiceName)
  getGameplayInstance(request: GetGameplayInstanceRequest) {
    return this.appService.getGameplayInstance(request);
  }
}
