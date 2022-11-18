import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SectorContent } from "../../ws/ws.protocol";
import { BaseGameplayInstance } from "../gameplay.base.instance";
import { GameplayBaseService } from "../gameplay.base.service";
import { GameplayIslandInstance } from "./gameplay.island.instance";

@Injectable()
export class GameplayIslandService extends GameplayBaseService {

    constructor(private readonly eventEmitter: EventEmitter2) {
        super();
    }

    public initiateGameplayInstance(x: number, y: number, sectorContent: SectorContent): BaseGameplayInstance {
        return new GameplayIslandInstance(this.eventEmitter, x, y, sectorContent)
    }

}