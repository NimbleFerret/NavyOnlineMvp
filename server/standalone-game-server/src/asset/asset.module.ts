/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Captain, CaptainSchema } from './asset.captain.entity';
import { Island, IslandSchema } from './asset.island.entity';
import { AssetService } from './asset.service';
import { Ship, ShipSchema } from './asset.ship.entity';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Captain.name, schema: CaptainSchema }]),
        MongooseModule.forFeature([{ name: Ship.name, schema: ShipSchema }]),
        MongooseModule.forFeature([{ name: Island.name, schema: IslandSchema }])
    ],
    providers: [AssetService],
    exports: [AssetService]
})
export class AssetModule { }
