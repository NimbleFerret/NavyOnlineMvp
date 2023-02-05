import { AuthServiceName, IssueTokenRequest, VerifyTokenRequest } from '@app/shared-library/gprc/grpc.auth.service';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) { }

  @GrpcMethod(AuthServiceName)
  issueToken(request: IssueTokenRequest) {
    return this.authService.issueToken(request);
  }

  @GrpcMethod(AuthServiceName)
  async verifyToken(request: VerifyTokenRequest) {
    return this.authService.verifyToken(request);
  }

}
