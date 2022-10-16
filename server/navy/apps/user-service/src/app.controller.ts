import { SignInOrUpRequest, UserServiceName } from '@app/shared-library/gprc/grpc.user.service';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @GrpcMethod(UserServiceName)
  signInOrUp(request: SignInOrUpRequest) {
    return this.appService.signInOrUp(request);
  }
}
