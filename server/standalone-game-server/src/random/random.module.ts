/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Random, RandomSchema } from './random.entity';
import { RandomService } from './random.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Random.name, schema: RandomSchema }]),
    ],
    providers: [RandomService],
    exports: [RandomService]
})
export class RandomModule { }
