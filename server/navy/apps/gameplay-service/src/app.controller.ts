import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('enter')
  enter() {
    console.log('enter');
  }

  // @GrpcMethod(GameplayServiceName)
  // creareOrJoinGame(request: CreareOrJoinGameRequest) {
  //   console.log();
  // }
}
