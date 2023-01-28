import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { Observable } from "rxjs";
import { Config } from "../config";

export interface WorldService {
    GenerateNewIslandPosition(request: IslandPositionRequest): Observable<IslandPositionResponse>;
    GetWorldInfo(request: WorldInfoRequest): Observable<WorldInfoResponse>;
    GetSectorInfo(request: SectorInfoRequest): Observable<SectorInfoResponse>;
    WorldMove(request: WorldMoveRequest): Observable<WorldMoveResponse>;
    AddNewIslandToSector(request: AddNewIslandToSectorRequest): Observable<AddNewIslandToSectorResponse>;
}

export const WorldServiceName = 'WorldService';
export const WorldServiceGrpcClientName = 'worldservice';
export const WorldServiceGrpcPackage = 'worldservice';

export const WorldServiceGrpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: 'localhost:' + Config.WORLD_SERVICE_PORT,
        package: WorldServiceGrpcPackage,
        protoPath: join(__dirname, '../../proto/world.service.proto'),
    },
};

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
    SECTOR_CONTENT_EMPTY = 0,
    SECTOR_CONTENT_BASE = 1,
    SECTOR_CONTENT_ISLAND = 2,
    SECTOR_CONTENT_BOSS = 3,
    SECTOR_CONTENT_PVE = 4,
    SECTOR_CONTENT_PVP = 5
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

export interface SectorInfoRequest {
    x: number;
    y: number;
}

export interface SectorInfoResponse {
    sector: SectorInfo;
}

//-----------------------------

export interface WorldMoveRequest {
    user: string;
    x: number;
    y: number;
}

export interface WorldMoveResponse {
    success: boolean;
}

//-----------------------------

export interface AddNewIslandToSectorRequest {
    tokenId: string;
}

export interface AddNewIslandToSectorResponse {
}

//-----------------------------