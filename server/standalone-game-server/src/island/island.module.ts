/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { IslandService } from './island.service';

@Module({
  providers: [IslandService],
  exports: [IslandService]
})
export class IslandModule { }
