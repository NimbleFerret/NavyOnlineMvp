import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { Observable } from "rxjs";

export interface IslandPositionRequest {
}

export interface IslandPositionResponse {
    x: number;
    y: number;
}

export interface WorldService {
    GenerateNewIslandPosition(request: IslandPositionRequest): Observable<IslandPositionResponse>;
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