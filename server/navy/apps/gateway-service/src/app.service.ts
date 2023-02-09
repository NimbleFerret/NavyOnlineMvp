import { SharedLibraryService } from '@app/shared-library';
import {
  AuthService,
  AuthServiceGrpcClientName,
  AuthServiceName
} from '@app/shared-library/gprc/grpc.auth.service';
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
import { Web3Service, Web3ServiceGrpcClientName, Web3ServiceName } from '@app/shared-library/gprc/grpc.web3.service';
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

  private readonly logger = new Logger(AppService.name);

  private authService: AuthService;
  private worldService: WorldService;
  private userService: UserService;
  private gameplayBalancerService: GameplayBalancerService;
  private web3Service: Web3Service;

  constructor(
    @Inject(AuthServiceGrpcClientName) private readonly authServiceGrpcClient: ClientGrpc,
    @Inject(WorldServiceGrpcClientName) private readonly worldServiceGrpcClient: ClientGrpc,
    @Inject(UserServiceGrpcClientName) private readonly userServiceGrpcClient: ClientGrpc,
    @Inject(GameplayBalancerServiceGrpcClientName) private readonly gameplayBalancerServiceGrpcClient: ClientGrpc,
    @Inject(Web3ServiceGrpcClientName) private readonly web3ServiceGrpcClient: ClientGrpc
  ) {
  }

  async onModuleInit() {
    this.authService = this.authServiceGrpcClient.getService<AuthService>(AuthServiceName);
    this.worldService = this.worldServiceGrpcClient.getService<WorldService>(WorldServiceName);
    this.userService = this.userServiceGrpcClient.getService<UserService>(UserServiceName);
    this.gameplayBalancerService = this.gameplayBalancerServiceGrpcClient.getService<GameplayBalancerService>(GameplayBalancerServiceName);
    this.web3Service = this.web3ServiceGrpcClient.getService<Web3Service>(Web3ServiceName);
  }

  async signUp(request: SignUpRequest) {
    const response = {
      success: false
    };

    if (await this.checkEthersAuthSignatureIfNeeded(request)) {
      const signUpResult = await lastValueFrom(this.userService.SignUp(request));
      if (!signUpResult.success) {
        response['reasonCode'] = signUpResult.reasonCode;
      } else {
        const issueTokenResult = await lastValueFrom(this.authService.IssueToken({ userId: signUpResult.userId }));
        response.success = true;
        response['token'] = issueTokenResult.token;
        response['userId'] = signUpResult.userId
      }
    }

    return response;
  }

  async signIn(request: SignUpRequest) {
    const response = {
      success: false
    };

    if (await this.checkEthersAuthSignatureIfNeeded(request)) {
      const findUserResult = await lastValueFrom(this.userService.FindUser({ email: request.email, ethAddress: request.ethAddress }));

      if (findUserResult.success) {
        if (request.email && findUserResult.password == request.password || request.ethAddress) {
          const issueTokenResult = await lastValueFrom(this.authService.IssueToken({ userId: findUserResult.id }));
          response.success = true;
          response['token'] = issueTokenResult.token;
        }
      }
    }

    return response;
  }

  private async checkEthersAuthSignatureIfNeeded(request: SignUpRequest) {
    const response = {
      success: false
    };
    let continueAuth = true;

    if (request.ethAddress && request.signedMessage && !request.email && !request.password) {
      const isMessageSignOk = await this.checkEthersAuthSignature(request.ethAddress, request.signedMessage);
      if (!isMessageSignOk.success) {
        continueAuth = false;
        response['reasonCode'] = SharedLibraryService.GENERAL_ERROR;
        this.logger.error(`signUp failed for ${request.ethAddress}, bad signature!`);
      }
    }

    return continueAuth;
  }

  private async checkEthersAuthSignature(address: string, signedMessage: string) {
    return await lastValueFrom(this.web3Service.CheckEthersAuthSignature({ address, signedMessage }));
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
