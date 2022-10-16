import {
  IslandPositionRequest,
  IslandPositionResponse,
  WorldInfoRequest,
  WorldInfoResponse
} from '@app/shared-library/gprc/grpc.world.service';
import { Controller, } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) { }

  @GrpcMethod('WorldService')
  generateNewIslandPosition(request: IslandPositionRequest) {
    return this.appService.generateNewIslandPosition();
  }

  @GrpcMethod('WorldService')
  async getWorldInfo(request: WorldInfoRequest) {
    return this.appService.getWorldInfo();
  }

}
