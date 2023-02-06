import { FindUserRequest, SignUpRequest } from '@app/shared-library/gprc/grpc.user.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorldMoveDto } from './app.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('signUp')
  async signUp(@Body() request: SignUpRequest) {
    request.email = request.email.toLowerCase();
    return this.appService.signUp(request);
  }

  @Post('signIn')
  async signIn(@Body() request: SignUpRequest) {
    request.email = request.email.toLowerCase();
    return this.appService.signIn(request);
  }

  @Get('auth/check')
  async authChech() {

  }

  @Get('world')
  async world() {
    return this.appService.getWorldInfo();
  }

  @Post('world/move')
  async worldMove(@Body() dto: WorldMoveDto) {
    dto.user = dto.user.toLowerCase();
    return this.appService.worldMove(dto);
  }

  @Get('gameplayInstance')
  async gameplayInstance() {
    return this.appService.getGameplayInstance();
  }

}
