import { SignUpRequest } from '@app/shared-library/gprc/grpc.user.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthUpdateDto, WorldMoveDto } from './dto/app.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  private index = 0;

  @Get('ping')
  ping() {
    return 'v4 pong ' + (++this.index);
  }

  @Post('auth/signUp')
  async authSignUp(@Body() request: SignUpRequest) {
    return this.appService.authSignUp(request);
  }

  @Post('auth/signIn')
  async authSignIn(@Body() request: SignUpRequest) {
    return this.appService.authSignIn(request);
  }

  @Post('auth/update')
  async authUpdate(@Body() request: AuthUpdateDto) {
    return this.appService.authUpdate(request);
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
