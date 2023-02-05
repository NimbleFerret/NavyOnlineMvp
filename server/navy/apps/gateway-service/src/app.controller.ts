import { Body, Controller, Get, Post } from '@nestjs/common';
import { SignInOrUpDto, WorldMoveDto } from './app.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('signUp')
  async signUp(@Body() dto: SignInOrUpDto) {
    dto.email = dto.email.toLowerCase();
    return this.appService.signUp({
      email: dto.email,
      password: dto.password
    });
  }

  @Post('signIn')
  async signIn(@Body() dto: SignInOrUpDto) {
    // TODO implement
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
