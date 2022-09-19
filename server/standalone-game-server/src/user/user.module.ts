/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AssetModule } from "../asset/asset.module";
import { MoralisModule } from "../moralis/moralis.module";
import { User, UserSchema } from "./user.entity";
import { UserService } from "./user.service";

@Module({
    imports: [
        MoralisModule,
        AssetModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }