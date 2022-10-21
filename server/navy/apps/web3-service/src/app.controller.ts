import { GetAndSyncUserAssetsRequest, Web3ServiceName } from '@app/shared-library/gprc/grpc.web3.service';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { MoralisService } from './moralis/moralis.service';

@Controller()
export class AppController {
  constructor(private readonly moralisService: MoralisService) { }

  @GrpcMethod(Web3ServiceName)
  getAndSyncUserAssets(request: GetAndSyncUserAssetsRequest) {
    return this.moralisService.getAndSyncUserAssets(request.address);
  }

}
