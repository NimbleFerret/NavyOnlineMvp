import { GetAndSyncUserAssetsRequest, GetCollectionOnSaleDetailsRequest, Web3ServiceName } from '@app/shared-library/gprc/grpc.web3.service';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BlockchainService } from './blockchain/blockchain.service';
import { MoralisService } from './moralis/moralis.service';

@Controller()
export class AppController {
  constructor(
    private readonly moralisService: MoralisService,
    private readonly blockchainService: BlockchainService,
  ) { }

  @GrpcMethod(Web3ServiceName)
  getAndSyncUserAssets(request: GetAndSyncUserAssetsRequest) {
    return this.moralisService.getAndSyncUserAssets(request.address);
  }

  @GrpcMethod(Web3ServiceName)
  getCollectionSaleDetails(request: GetCollectionOnSaleDetailsRequest) {
    return this.blockchainService.getCollectionSaleDetails(request);
  }

}
