/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
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


}