import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorldEnterDto, WorldMoveDto } from './add.dto';
import { AppService } from './app.service';

// TODO add auth tokens
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('signInOrUp')
  signInOrUp() {

  }

  @Get('world')
  async world() {
    return this.appService.getWorldInfo();
  }

  @Post('world/move')
  async worldMove(@Body() dto: WorldMoveDto) {
    return this.appService.worldMove(dto);
  }

  @Post('world/enter')
  async worldEnter(@Body() dto: WorldEnterDto) {
  }

}
