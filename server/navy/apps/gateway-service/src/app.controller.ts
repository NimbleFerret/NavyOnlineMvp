import { SignUpRequest } from '@app/shared-library/gprc/grpc.user.service';
import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { SignInOrUpDto, WorldEnterDto, WorldMoveDto } from './app.dto';
import { AppService } from './app.service';

// TODO add auth tokens
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('signUp')
  async signUp(@Body() dto: SignUpRequest) {
    dto.email = dto.email.toLowerCase();
    return this.appService.signUp(dto);
  }

  // @Post('signInOrUp')
  // async signInOrUp(@Body() dto: SignInOrUpDto) {
  //   dto.user = dto.user.toLowerCase();
  //   return this.appService.signInOrUp(dto);
  // }

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
