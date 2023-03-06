import { Body, Controller, Get, Post } from '@nestjs/common';
import { AddBotRequestDto, CreateOrJoinGameRequestDto } from './app.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('createOrJoinGame')
  async createOrJoinGame(@Body() dto: CreateOrJoinGameRequestDto) {
    return this.appService.createOrJoinGame(dto);
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
