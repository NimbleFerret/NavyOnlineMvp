import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { Observable } from "rxjs";

//-----------------------------
export interface IslandPositionRequest {
}

export interface IslandPositionResponse {
    x: number;
    y: number;
    success: boolean;
}

//-----------------------------

export enum SectorContent {
    SECTOR_CONTENT_EMPTY = 1,
    SECTOR_CONTENT_BASE = 2,
    SECTOR_CONTENT_ISLAND = 3,
    SECTOR_CONTENT_BOSS = 4,
    SECTOR_CONTENT_PVE = 5,
    SECTOR_CONTENT_PVP = 6
}

export interface SectorInfo {
    x: number;
    y: number;
    sectorContent: SectorContent;
}

export interface WorldInfoRequest {
}

export interface WorldInfoResponse {
    sectors: SectorInfo[];
}

//-----------------------------

export interface WorldService {
    GenerateNewIslandPosition(request: IslandPositionRequest): Observable<IslandPositionResponse>;
    GetWorldInfo(request: WorldInfoRequest): Observable<WorldInfoResponse>;
}

export const WorldServiceName = 'WorldService';
export const WorldServiceGrpcPackage = 'worldservice';

export const WorldServiceGrpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: 'localhost:3001',
        package: WorldServiceGrpcPackage, // ['hero', 'hero2']
        protoPath: join(__dirname, '../../proto/world.service.proto'), // ['./hero/hero.proto', './hero/hero2.proto']
    },
};