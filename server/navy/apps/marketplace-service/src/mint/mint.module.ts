import { Module } from '@nestjs/common';
import { MintService } from './mint.service';

@Module({
  imports: [],
  providers: [MintService],
})
export class MintModule { }
