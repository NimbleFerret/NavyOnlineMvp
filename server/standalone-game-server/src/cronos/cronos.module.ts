/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { WorldModule } from 'src/world/world.module';
import { AssetModule } from '../asset/asset.module';
import { CronosService } from './cronos.service';

@Module({
  imports: [
    AssetModule,
    WorldModule
  ],
  providers: [CronosService],
  exports: [CronosService]
})
export class CronosModule { }
