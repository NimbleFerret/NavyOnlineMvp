import { UserService, UserServiceGrpcClientName, UserServiceName } from '@app/shared-library/gprc/grpc.user.service';
import { WorldService, WorldServiceGrpcClientName, WorldServiceName } from '@app/shared-library/gprc/grpc.world.service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { SignInOrUpDto, WorldMoveDto } from './app.dto';

@Injectable()
export class AppService implements OnModuleInit {

  private worldService: WorldService;
  private userService: UserService;

  constructor(
    @Inject(WorldServiceGrpcClientName) private readonly worldServiceGrpcClient: ClientGrpc,
    @Inject(UserServiceGrpcClientName) private readonly userServiceGrpcClient: ClientGrpc
  ) { }

  async onModuleInit() {
    this.worldService = this.worldServiceGrpcClient.getService<WorldService>(WorldServiceName);
    this.userService = this.userServiceGrpcClient.getService<UserService>(UserServiceName);
  }

  signInOrUp(dto: SignInOrUpDto) {
    return this.userService.SignInOrUp(dto);
  }

  getWorldInfo() {
    return this.worldService.GetWorldInfo({});
  }

  worldMove(dto: WorldMoveDto) {

  }

}
