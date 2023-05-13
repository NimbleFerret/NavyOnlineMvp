import { EntityServiceName, GenerateCaptainTraitsRequest, GetRandomCaptainTraitRequest } from '@app/shared-library/gprc/grpc.entity.service';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @GrpcMethod(EntityServiceName)
  getRandomCaptainTrait(request: GetRandomCaptainTraitRequest) {
    return this.appService.getRandomCaptainTrait(request);
  }

  @GrpcMethod(EntityServiceName)
  generateCaptainTraits(request: GenerateCaptainTraitsRequest) {
    return this.appService.generateCaptainTraits(request);
  }
}
