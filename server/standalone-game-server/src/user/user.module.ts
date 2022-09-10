/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ShipyardModule } from "src/shipyard/shipyard.module";
import { WorldModule } from "src/world/world.module";
import { User, UserSchema } from "./user.entity";
import { UserService } from "./user.service";

@Module({
    imports: [
        WorldModule,
        ShipyardModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }