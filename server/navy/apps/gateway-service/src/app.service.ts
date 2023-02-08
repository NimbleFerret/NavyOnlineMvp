import { SharedLibraryService } from '@app/shared-library';
import { AuthService, AuthServiceGrpcClientName, AuthServiceName } from '@app/shared-library/gprc/grpc.auth.service';
import {
  GameplayBalancerService,
  GameplayBalancerServiceGrpcClientName,
  GameplayBalancerServiceName
} from '@app/shared-library/gprc/grpc.gameplay-balancer.service';
import {
  FindUserRequest,
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
  WorldMoveDto
} from './app.dto';

// TODO make all resonses more generic
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
  }

  async signUp(request: SignUpRequest) {
    const result = await lastValueFrom(this.userService.SignUp(request));
    const response = {};
    if (!result.success) {
      response['success'] = false;
      response['reasonCode'] = result.reasonCode;
    } else {
      const issueTokenResult = await lastValueFrom(this.authService.IssueToken({ email: request.email, password: request.password }));
      if (issueTokenResult.success) {
        response['success'] = true;
        response['token'] = issueTokenResult.token;
      } else {
        response['success'] = false;
        response['reasonCode'] = SharedLibraryService.GENERAL_ERROR;
      }
    }
    return response;
  }

  async signIn(request: SignUpRequest) {
    const findUserReuqest = { email: request.email } as FindUserRequest;
    const result = await lastValueFrom(this.userService.FindUser(findUserReuqest));
    const response = {
      success: false
    };
    if (result.success) {
      if (result.password == request.password) {
        const issueTokenResult = await lastValueFrom(this.authService.IssueToken({ email: request.email, password: request.password }));
        if (issueTokenResult.success) {
          response.success = true;
          response['token'] = issueTokenResult.token;
        }
      }
    }
    return response;
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
