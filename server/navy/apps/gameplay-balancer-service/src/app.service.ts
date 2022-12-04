import { Config } from '@app/shared-library/config';
import {
  GameplayServicePingRequest,
  GetGameplayInstanceRequest,
  GetGameplayInstanceResponse
} from '@app/shared-library/gprc/grpc.gameplay-balancer.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

interface GameplayInstance {
  lastPingTime: number;
  instanceDetails: GameplayServicePingRequest;
}

@Injectable()
export class AppService {

  private readonly gameplayInstances = new Map<String, GameplayInstance>;

  gameplayServicePing(request: GameplayServicePingRequest) {
    const gameplayInstance: GameplayInstance = {
      lastPingTime: new Date().getTime(),
      instanceDetails: request
    }
    this.gameplayInstances.set(request.address + '_' + request.region, gameplayInstance);
  }

  getGameplayInstance(request: GetGameplayInstanceRequest) {
    let gameplayInstance: GameplayInstance;
    // Select by region of possible
    if (request.region) {
      this.gameplayInstances.forEach((value: GameplayInstance, key: string) => {
        if (value.instanceDetails.region == request.region && !gameplayInstance) {
          gameplayInstance = value;
        }
      });
    } else {
      // Default region here
      this.gameplayInstances.forEach((value: GameplayInstance, key: string) => {
        if (value.instanceDetails.region == Config.GAMEPLAY_SERVICE_DEFAULT_REGION && !gameplayInstance) {
          gameplayInstance = value;
        }
      });
    }
    return {
      address: gameplayInstance.instanceDetails.address,
      region: gameplayInstance.instanceDetails.region
    } as GetGameplayInstanceResponse;
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  checkInstanceLastPingTime() {
    const now = new Date().getTime();
    const instancesToDelete: string[] = [];
    this.gameplayInstances.forEach((value: GameplayInstance) => {
      if (value.lastPingTime + 6000 < now) {
        console.log('Remove gameplay instance');
        instancesToDelete.push(this.gameplayInstanceKey(value));
      }
    });
  }

  private gameplayInstanceKey(instance: GameplayInstance) {
    return instance.instanceDetails.address + '_' + instance.instanceDetails.region;
  }

}
