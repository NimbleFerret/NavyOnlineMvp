import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { Observable } from "rxjs";
import { Config } from "../config";
import { CaptainEntity } from "../entities/entity.captain";
import { IslandEntity } from "../entities/entity.island";
import { ShipEntity } from "../entities/entity.ship";

//-----------------------------

export interface GetUserAssetsRequest {
    address: string;
}

export interface GetUserAssetsResponse {
    nvy?: number;
    aks?: number;
    captains?: CaptainEntity[];
    ships?: ShipEntity[];
    islands?: IslandEntity[];
}

//-----------------------------

export interface Web3Service {
    GetUserAssets(request: GetUserAssetsRequest): Observable<GetUserAssetsResponse>;
}

export const Web3ServiceName = 'Web3Service';
export const Web3ServiceGrpcClientName = 'Web3ServiceGrpcClient';
export const Web3ServiceGrpcPackage = 'web3service';

export const Web3ServiceGrpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: 'localhost:' + Config.WEB3_SERVICE_PORT,
        package: Web3ServiceGrpcPackage,
        protoPath: join(__dirname, '../../proto/web3.service.proto'),
    },
};