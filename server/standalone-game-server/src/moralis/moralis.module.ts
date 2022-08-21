/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MoralisService } from './moralis.service';

@Module({
  providers: [MoralisService],
})
export class MoralisModule { }
