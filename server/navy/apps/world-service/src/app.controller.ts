import { IslandPositionRequest, IslandPositionResponse } from '@app/shared-library/gprc/grpc.world.service';
import { Controller, } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) { }

  @GrpcMethod('WorldService')
  generateNewIslandPosition(request: IslandPositionRequest): IslandPositionResponse {
    return this.appService.generateNewIslandPosition();
  }

}
