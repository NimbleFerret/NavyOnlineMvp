/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shipyard, ShipyardDocument } from './shipyard.entity';

@Injectable()
export class ShipyardService implements OnModuleInit {

    private shipyard: Shipyard;

    constructor(@InjectModel(Shipyard.name) private shipyardModel: Model<ShipyardDocument>) {
    }

    async onModuleInit() {
        const shyrd = await this.shipyardModel.findOne();
        if (!shyrd) {
            const newShipyard = new this.shipyardModel();
            await newShipyard.save();
            this.shipyard = newShipyard;
        } else {
            this.shipyard = shyrd;
        }
    }

}
