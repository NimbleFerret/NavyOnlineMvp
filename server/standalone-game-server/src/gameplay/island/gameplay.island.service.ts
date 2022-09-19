/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Ship, ShipDocument } from "src/asset/asset.ship.entity";
import { GameplayBaseService, GameplayType } from "../gameplay.base.service";

@Injectable()
export class GameplayIslandService extends GameplayBaseService {

    constructor(@InjectModel(Ship.name) shipModel: Model<ShipDocument>, private readonly emitter: EventEmitter2) {
        super(shipModel, emitter, GameplayType.Island);
    }

}