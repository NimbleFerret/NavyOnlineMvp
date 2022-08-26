/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule { }
