import {
  AttachEmailOrEthAddressRequest,
  FindUserRequest,
  GetUserPosRequest,
  SignUpRequest,
  UserServiceName
} from '@app/shared-library/gprc/grpc.user.service';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) { }

  @GrpcMethod(UserServiceName)
  signUp(request: SignUpRequest) {
    return this.authService.signUp(request);
  }

  @GrpcMethod(UserServiceName)
  attachEmailOrEthAddress(request: AttachEmailOrEthAddressRequest) {
    return this.authService.attachEmailOrEthAddress(request);
  }

  // @GrpcMethod(UserServiceName)
  // findUser(request: FindUserRequest) {
  //   return this.appService.findUser(request);
  // }

  // @GrpcMethod(UserServiceName)
  // getUserPos(request: GetUserPosRequest) {
  //   return this.appService.getUserPos(request);
  // }

}
