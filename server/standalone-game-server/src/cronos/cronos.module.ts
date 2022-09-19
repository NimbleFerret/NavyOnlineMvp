/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AssetModule } from '../asset/asset.module';
import { CronosService } from './cronos.service';

@Module({
  imports: [AssetModule],
  providers: [CronosService],
  exports: [CronosService]
})
export class CronosModule { }
