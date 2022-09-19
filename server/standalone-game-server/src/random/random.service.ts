/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ShipSize } from "src/asset/asset.ship.entity";
import { Random, RandomDocument } from "./random.entity";

@Injectable()
export class RandomService implements OnModuleInit {

    private random: Random;

    constructor(@InjectModel(Random.name) private randomModel: Model<RandomDocument>) {
    }

    async onModuleInit() {
        const rnd = await this.randomModel.findOne();
        if (!rnd) {
            const newRandom = new this.randomModel();
            await newRandom.save();
            this.random = newRandom;
        } else {
            this.random = rnd;
        }
    }

    public generateShipSize(preferredSize?: ShipSize) {
        if (!preferredSize) {
            const rnd = RandomService.GetRandomIntInRange(1, 100);
            if (rnd > this.random.middleChance) {
                return ShipSize.SMALL;
            } else {
                return ShipSize.MIDDLE;
            }
        }
        return preferredSize;
    }

    public generateShipGuns(minGuns: number, maxGuns: number, additionalGunChance: number) {
        let shipGuns = minGuns;
        for (let i = 0; i < maxGuns + minGuns; i++) {
            const rnd = RandomService.GetRandomIntInRange(1, 100);
            if (additionalGunChance >= rnd) {
                shipGuns++;
            }
        }

        return shipGuns;
    }

    public static GetRandomIntInRange(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}