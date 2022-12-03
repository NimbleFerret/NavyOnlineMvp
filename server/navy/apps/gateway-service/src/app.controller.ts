import { Body, Controller, Get, Post } from '@nestjs/common';
import { SignInOrUpDto, WorldEnterDto, WorldMoveDto } from './app.dto';
import { AppService } from './app.service';

// TODO add auth tokens
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('signInOrUp')
  async signInOrUp(@Body() dto: SignInOrUpDto) {
    dto.user = dto.user.toLowerCase();
    return this.appService.signInOrUp(dto);
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

  @Post('world/enter')
  async worldEnter(@Body() dto: WorldEnterDto) {
    dto.user = dto.user.toLowerCase();
    return this.appService.worldEnter(dto);
  }

  @Get('gameplayInstance')
  async gameplayInstance() {
    return this.appService.getGameplayInstance();
  }

}
