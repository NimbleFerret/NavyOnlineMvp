import { Body, Controller, Get, Post } from '@nestjs/common';
import { AddBotRequestDto, AddInstanceRequestDto, CreateOrJoinGameRequestDto, EnableFeatureRequestDto, KillBotsRequestDto, KillInstanceRequestDto } from './app.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('createOrJoinGame')
  async createOrJoinGame(@Body() dto: CreateOrJoinGameRequestDto) {
    return this.appService.createOrJoinGame(dto);
  }

  // ---------------------------
  // Admin api
  // ---------------------------

  @Post('enableShooting')
  async enableShooting(@Body() dto: EnableFeatureRequestDto) {
    return this.appService.enableShooting(dto);
  }

  @Post('enableCollisions')
  async enableCollisions(@Body() dto: EnableFeatureRequestDto) {
    return this.appService.enableCollisions(dto);
  }

  @Post('addInstance')
  async addInstance(@Body() dto: AddInstanceRequestDto) {
    return this.appService.addInstance(dto);
  }

  @Post('addBot')
  async addBot(@Body() dto: AddBotRequestDto) {
    return this.appService.addBot(dto);
  }

  @Post('killBots')
  async killBots(@Body() dto: KillBotsRequestDto) {
    return this.appService.killBots(dto);
  }

  @Post('killInstance')
  async killInstance(@Body() dto: KillInstanceRequestDto) {
    return this.appService.killInstance(dto);
  }

  @Get('instancesInfo')
  async getInstancesInfo() {
    return this.appService.getInstancesInfo();
  }

}
