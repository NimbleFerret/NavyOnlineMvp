/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { GameplayBaseService, GameplayType } from "../gameplay.base.service";

@Injectable()
export class GameplayIslandService extends GameplayBaseService {

    constructor(private readonly emitter: EventEmitter2) {
        super(undefined, emitter, GameplayType.Island);
    }

}