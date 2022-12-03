import {
  GameplayBalancerService,
  GameplayBalancerServiceGrpcClientName,
  GameplayBalancerServiceName
} from '@app/shared-library/gprc/grpc.gameplay-balancer.service';
import {
  UserService,
  UserServiceGrpcClientName,
  UserServiceName
} from '@app/shared-library/gprc/grpc.user.service';
import {
  SectorContent,
  WorldService,
  WorldServiceGrpcClientName,
  WorldServiceName
} from '@app/shared-library/gprc/grpc.world.service';
import {
  Inject,
  Injectable,
  OnModuleInit
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  SignInOrUpDto,
  WorldEnterDto,
  WorldMoveDto
} from './app.dto';

@Injectable()
export class AppService implements OnModuleInit {

  private worldService: WorldService;
  private userService: UserService;
  private gameplayBalancerService: GameplayBalancerService;

  constructor(
    @Inject(WorldServiceGrpcClientName) private readonly worldServiceGrpcClient: ClientGrpc,
    @Inject(UserServiceGrpcClientName) private readonly userServiceGrpcClient: ClientGrpc,
    @Inject(GameplayBalancerServiceGrpcClientName) private readonly gameplayBalancerServiceGrpcClient: ClientGrpc
  ) {
  }

  async onModuleInit() {
    this.worldService = this.worldServiceGrpcClient.getService<WorldService>(WorldServiceName);
    this.userService = this.userServiceGrpcClient.getService<UserService>(UserServiceName);
    this.gameplayBalancerService = this.gameplayBalancerServiceGrpcClient.getService<GameplayBalancerService>(GameplayBalancerServiceName);
  }

  signInOrUp(dto: SignInOrUpDto) {
    return this.userService.SignInOrUp(dto);
  }

  getWorldInfo() {
    return this.worldService.GetWorldInfo({});
  }

  worldMove(dto: WorldMoveDto) {
    return this.worldService.WorldMove(dto);
  }

  async getGameplayInstance() {
    const gameplayInstance = await lastValueFrom(this.gameplayBalancerService.GetGameplayInstance({
      region: null
    }));
    console.log(gameplayInstance);
  }

  async worldEnter(dto: WorldEnterDto) {
    const userPos = await lastValueFrom(this.userService.GetUserPos({
      user: dto.user
    }));
    const sectorInfo = await lastValueFrom(this.worldService.GetSectorInfo({
      x: userPos.x,
      y: userPos.y
    }));
    console.log(sectorInfo);

    // enum SectorContent {
    //   SECTOR_CONTENT_EMPTY = 0;
    //   SECTOR_CONTENT_BASE = 1;
    //   SECTOR_CONTENT_ISLAND = 2;
    //   SECTOR_CONTENT_BOSS = 3;
    //   SECTOR_CONTENT_PVE = 4;
    //   SECTOR_CONTENT_PVP = 5;
    // }

    // message SectorInfo {
    //   int32 x = 1;
    //   int32 y = 2;
    //   SectorContent sectorContent = 3;

    // client.sayHello({name: 'you'}, function(err, response) {
    //   console.log('Greeting:', response.message);
    // });

    // message CreateOrJoinGameRequest {
    //   int32 x = 1;
    //   int32 y = 2;
    //   int32 sectorType = 3;
    // }

    // gameplayServiceGrpcClient.


    switch (sectorInfo.sector.sectorContent) {
      case SectorContent.SECTOR_CONTENT_BASE:
      case SectorContent.SECTOR_CONTENT_ISLAND:
        console.log('');
    }



    // Create or join game
  }


}
