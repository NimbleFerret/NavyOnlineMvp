// /* eslint-disable prettier/prettier */

// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Rarity } from '../random/random.entity';
// import { RandomService } from '../random/random.service';
// import { Shipyard, ShipyardDocument } from './shipyard.entity';
// import { PlayerShipEntity, Ship, ShipDocument, ShipSize, ShipType } from '../asset/asset.ship.entity';
// import { ShipStatsRange, ShipStatsStep } from '../cronos/cronos.service';
// import { NftShipGenerator } from '../nft/nft.ship.generator';

// @Injectable()
// export class ShipyardService implements OnModuleInit {

//     private shipyard: Shipyard;


//     constructor(
//         private randomService: RandomService,
//         @InjectModel(Ship.name) private shipModel: Model<ShipDocument>,
//         @InjectModel(Shipyard.name) private shipyardModel: Model<ShipyardDocument>) {
//         this.nftShipGenerator = new NftShipGenerator();
//     }

//     async onModuleInit() {
//         const shipyard = await this.shipyardModel.findOne();
//         if (!shipyard) {
//             const newShipyard = new this.shipyardModel();
//             await newShipyard.save();
//             this.shipyard = newShipyard;
//         } else {
//             this.shipyard = shipyard;
//         }
//     }
// }
