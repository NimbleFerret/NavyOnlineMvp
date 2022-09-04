/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { BaseGameplayInstance } from "../gameplay.base.instance";
import { GameplayBaseService, GameplayType } from "../gameplay.base.service";

@Injectable()
export class GameplayIslandService extends GameplayBaseService {

    constructor(private readonly emitter: EventEmitter2) {
        super(emitter, GameplayType.Island);
    }

    public customInstanceInit(instance: BaseGameplayInstance) {
        console.log();
    }
}