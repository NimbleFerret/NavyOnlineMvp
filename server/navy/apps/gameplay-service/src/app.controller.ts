import { Body, Controller, Get, Post } from '@nestjs/common';
import { AddBotRequestDto, CreateOrJoinGameRequestDto, EnableFeatureRequestDto } from './app.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('createOrJoinGame')
  async createOrJoinGame(@Body() dto: CreateOrJoinGameRequestDto) {
    return this.appService.createOrJoinGame(dto);
  }

  @Post('enableShooting')
  async enableShooting(@Body() dto: EnableFeatureRequestDto) {
    return this.appService.enableShooting(dto);
  }

  @Post('enableCollisions')
  async enableCollisions(@Body() dto: EnableFeatureRequestDto) {
    return this.appService.enableCollisions(dto);
  }

  @Post('addBot')
  async addBot(@Body() dto: AddBotRequestDto) {
    return this.appService.addBot(dto);
  }

  @Get('instancesInfo')
  async getInstancesInfo() {
    return this.appService.getInstancesInfo();
  }

}
