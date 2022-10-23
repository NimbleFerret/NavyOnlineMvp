import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { Observable } from "rxjs";
import { Config } from "../config";

export interface GameplayBalancerService {
    GameplayServicePing(request: GameplayServicePingRequest): Observable<GameplayServicePingResponse>;
    GetGameplayInstance(request: GetGameplayInstanceRequest): Observable<GetGameplayInstanceResponse>;
}

export const GameplayBalancerServiceName = 'GameplayBalancerService';
export const GameplayBalancerServiceGrpcClientName = 'gameplaybalancerservice';
export const GameplayBalancerServiceGrpcPackage = 'gameplaybalancerservice';

export const GameplayBalancerServiceGrpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: 'localhost:' + Config.GAMEPLAY_BALANCER_SERVICE_PORT,
        package: GameplayBalancerServiceGrpcPackage,
        protoPath: join(__dirname, '../../proto/gameplay-balancer.service.proto'),
    },
};

//-----------------------------

export interface InstanceDetails {
    id: string;
    players: string;
    bots: number;
    x: number;
    y: number;
}

export interface GameplayServicePingRequest {
    address: string;
    region: string;
    battleInstances: InstanceDetails[];
    islandInstances: InstanceDetails[];
}

export interface GameplayServicePingResponse {
}

//-----------------------------

export interface GetGameplayInstanceRequest {
    region: string;
}

export interface GetGameplayInstanceResponse {
    address: string;
    region: string;
}

//-----------------------------