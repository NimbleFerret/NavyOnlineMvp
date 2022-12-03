import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrJoinGameRequestDto } from './app.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('createOrJoinGame')
  async createOrJoinGame(@Body() dto: CreateOrJoinGameRequestDto) {
    await this.appService.createOrJoinGame(dto);
  }

}
