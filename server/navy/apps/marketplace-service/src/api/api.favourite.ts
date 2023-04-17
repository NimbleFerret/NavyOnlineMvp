import { Injectable, OnModuleInit } from "@nestjs/common";
import { FavouriteDto } from "../dto/dto.favourite";

@Injectable()
export class FavouriteApiService implements OnModuleInit {

    constructor() {
    }

    onModuleInit() {
        throw new Error("Method not implemented.");
    }

    async favouriteAdd(dto: FavouriteDto) {
    }

    async favouriteRemove(dto: FavouriteDto) {
    }
}