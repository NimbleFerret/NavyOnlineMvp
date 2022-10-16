import { WorldService, WorldServiceGrpcClientName, WorldServiceName } from '@app/shared-library/gprc/grpc.world.service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { WorldMoveDto } from './add.dto';

@Injectable()
export class AppService implements OnModuleInit {

  private worldService: WorldService;

  constructor(
    @Inject(WorldServiceGrpcClientName) private readonly worldServiceGrpcClient: ClientGrpc
  ) { }

  async onModuleInit() {
    this.worldService = this.worldServiceGrpcClient.getService<WorldService>(WorldServiceName);
  }

  getWorldInfo() {
    return this.worldService.GetWorldInfo({});
  }

  worldMove(dto: WorldMoveDto) {

  }

}
