import {
  IslandPositionRequest,
  WorldInfoRequest,
  WorldMoveRequest,
  WorldServiceName
} from '@app/shared-library/gprc/grpc.world.service';
import { Controller, } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) { }

  @GrpcMethod(WorldServiceName)
  generateNewIslandPosition(request: IslandPositionRequest) {
    return this.appService.generateNewIslandPosition();
  }

  @GrpcMethod(WorldServiceName)
  async getWorldInfo(request: WorldInfoRequest) {
    return this.appService.getWorldInfo();
  }

  @GrpcMethod(WorldServiceName)
  async worldMove(request: WorldMoveRequest) {
    return this.appService.worldMove(request);
  }

}
