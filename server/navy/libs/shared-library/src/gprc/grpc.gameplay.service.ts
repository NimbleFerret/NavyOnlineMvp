import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { Observable } from "rxjs";
import { Config } from "../config";

export interface GameplayService {
    CreareOrJoinGame(request: CreareOrJoinGameRequest): Observable<CreareOrJoinGameResponse>;
}

export const GameplayServiceName = 'GameplayService';
export const GameplayServiceGrpcClientName = 'gameplayservice';
export const GameplayServiceGrpcPackage = 'gameplayservice';

export function GameplayServiceGrpcClientOptions(port: number) {
    return {
        transport: Transport.GRPC,
        options: {
            url: 'localhost:' + port,
            package: GameplayServiceGrpcPackage,
            protoPath: join(__dirname, '../../proto/gameplay.service.proto'),
        }
    } as ClientOptions
};

//-----------------------------

export interface CreareOrJoinGameRequest {
}

export interface CreareOrJoinGameResponse {
}

//-----------------------------