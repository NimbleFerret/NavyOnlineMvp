import { Injectable } from "@nestjs/common";
import { FavouriteDto } from "../dto/dto.favourite";

@Injectable()
export class FavouriteApiService {

    constructor() {
    }

    async favouriteAdd(dto: FavouriteDto) {
    }

    async favouriteRemove(dto: FavouriteDto) {
    }
}