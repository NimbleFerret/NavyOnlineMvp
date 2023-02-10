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
  AttachOperation,
  FindUserRequest,
  SignUpRequest,
  SignUpState,
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
  AuthUpdateDto,
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

  async authSignUp(request: SignUpRequest) {
    const response = {
      success: false
    };

    if (await this.checkEthersAuthSignatureIfNeeded(request)) {
      const signUpResult = await lastValueFrom(this.userService.SignUp(request));
      if (!signUpResult.success) {
        response['reasonCode'] = signUpResult.reasonCode;
      } else {
        response.success = true;
        if (signUpResult.signUpState == SignUpState.DONE) {
          const issueTokenResult = await lastValueFrom(this.authService.IssueToken({ userId: signUpResult.userId }));
          response['token'] = issueTokenResult.token;
          response['userId'] = signUpResult.userId
        } else {
          response['signUpState'] = SignUpState.WAITING_FOR_EMAIL_CONFIRMATION;
        }
      }
    }

    return response;
  }

  async authSignIn(request: SignUpRequest) {
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

  // TODO implement email code check
  async authUpdate(request: AuthUpdateDto) {
    const response = {
      success: false
    };

    let continueAuthUpdate = true;

    if (request.operation == AttachOperation.ATTACH_ETH_ADDRESS && request.ethAddress && request.signedMessage && request.email) {
      const checkSignatureResult = await this.checkEthersAuthSignature(request.ethAddress, request.signedMessage);
      if (!checkSignatureResult.success) {
        continueAuthUpdate = false;
        response['reasonCode'] = SharedLibraryService.GENERAL_ERROR;
        this.logger.error(`signUp failed for ${request.ethAddress}, bad signature!`);
      }
    }

    const attachResult = await lastValueFrom(this.userService.AttachEmailOrEthAddress({
      operation: request.operation,
      email: request.email,
      ethAddress: request.ethAddress
    }));

    if (attachResult.success) {
      response.success = true;
    } else {
      response['reasonCode'] = attachResult.reasonCode;
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
