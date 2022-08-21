/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GameService } from './game.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [GameService],
})
export class GameModule { }
