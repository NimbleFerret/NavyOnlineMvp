import { AuthService, AuthServiceGrpcClientName, AuthServiceName } from '@app/shared-library/gprc/grpc.auth.service';
import {
  GameplayBalancerService,
  GameplayBalancerServiceGrpcClientName,
  GameplayBalancerServiceName
} from '@app/shared-library/gprc/grpc.gameplay-balancer.service';
import {
  SignUpRequest,
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
  Logger,
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

  private authService: AuthService;

  private worldService: WorldService;
  private userService: UserService;
  private gameplayBalancerService: GameplayBalancerService;

  constructor(
    @Inject(AuthServiceGrpcClientName) private readonly authServiceGrpcClient: ClientGrpc,
    @Inject(WorldServiceGrpcClientName) private readonly worldServiceGrpcClient: ClientGrpc,
    @Inject(UserServiceGrpcClientName) private readonly userServiceGrpcClient: ClientGrpc,
    @Inject(GameplayBalancerServiceGrpcClientName) private readonly gameplayBalancerServiceGrpcClient: ClientGrpc
  ) {
  }

  async onModuleInit() {
    this.authService = this.authServiceGrpcClient.getService<AuthService>(AuthServiceName);
    this.worldService = this.worldServiceGrpcClient.getService<WorldService>(WorldServiceName);
    this.userService = this.userServiceGrpcClient.getService<UserService>(UserServiceName);
    this.gameplayBalancerService = this.gameplayBalancerServiceGrpcClient.getService<GameplayBalancerService>(GameplayBalancerServiceName);

    const result = await lastValueFrom(this.authService.IssueToken({ email: 'john', password: 'changeme' }));
    console.log(result);

    const result2 = await lastValueFrom(this.authService.VerifyToken({ token: result.token }));
    console.log(result2);
  }

  getWorldInfo() {
    return this.worldService.GetWorldInfo({});
  }

  worldMove(dto: WorldMoveDto) {
    return this.worldService.WorldMove(dto);
  }

  getGameplayInstance() {
    return lastValueFrom(this.gameplayBalancerService.GetGameplayInstance({
      region: null
    }));
  }

}
