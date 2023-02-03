import { GetUserPosRequest, SignUpRequest, UserServiceName } from '@app/shared-library/gprc/grpc.user.service';
import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @GrpcMethod(UserServiceName)
  signUp(request: SignUpRequest) {
    return this.appService.signUp(request);
  }

  @GrpcMethod(UserServiceName)
  getUserPos(request: GetUserPosRequest) {
    return this.appService.getUserPos(request);
  }

}
