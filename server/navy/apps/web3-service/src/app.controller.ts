import { GetAndSyncUserAssetsRequest, Web3ServiceName } from '@app/shared-library/gprc/grpc.web3.service';
import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { MoralisService } from './moralis/moralis.service';

@Controller()
export class AppController {
  constructor(private readonly moralisService: MoralisService) { }

  @GrpcMethod(Web3ServiceName)
  getAndSyncUserAssets(request: GetAndSyncUserAssetsRequest) {
    return this.moralisService.getAndSyncUserAssets(request.address);
  }

  // TODO implement simple web3 http api here for testing purpose
  @Get('test')
  async web3Test() {
    return 'this is web3 test';
  }

}
