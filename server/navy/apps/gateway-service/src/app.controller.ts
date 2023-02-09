import { SignUpRequest } from '@app/shared-library/gprc/grpc.user.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorldMoveDto } from './app.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('auth/signUp')
  async signUp(@Body() request: SignUpRequest) {
    return this.appService.signUp(request);
  }

  @Post('auth/signIn')
  async signIn(@Body() request: SignUpRequest) {
    return this.appService.signIn(request);
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
