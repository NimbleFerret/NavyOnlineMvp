/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ShipyardModule } from 'src/shipyard/shipyard.module';
import { CronosService } from './cronos.service';

@Module({
  imports: [ShipyardModule],
  providers: [CronosService],
})
export class CronosModule { }
