/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IslandInstance } from './island.instance';


@Injectable()
export class IslandService {

    private readonly maxPlayersPerInstance = 10;
    private readonly gameInstances = new Map<string, GameInstance>();
    private readonly sectorInstance = new Map<string, string>();
    private readonly playerInstaneMap = new Map<string, string>();

    constructor(private eventEmitter: EventEmitter2) {
    }



}
