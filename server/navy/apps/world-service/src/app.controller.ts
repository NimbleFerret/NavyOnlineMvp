import { IslandPositionRequest, IslandPositionResponse } from '@app/shared-library/gprc/grpc.world.service';
import { Controller, } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AppController {

  @GrpcMethod('WorldService')
  generateNewIslandPosition(request: IslandPositionRequest): IslandPositionResponse {
    console.log('WorldService generateNewIslandPosition');
    return {
      x: 1,
      y: 1
    }
  }

}
