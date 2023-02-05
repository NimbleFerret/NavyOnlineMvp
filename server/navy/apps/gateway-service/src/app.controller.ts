import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorldMoveDto } from './app.dto';
import { AppService } from './app.service';

// TODO add auth tokens
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @Post('signInOrUp')
  // async signInOrUp(@Body() dto: SignInOrUpDto) {
  //   dto.user = dto.user.toLowerCase();
  //   return this.appService.signInOrUp(dto);
  // }

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
