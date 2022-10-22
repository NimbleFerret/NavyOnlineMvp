import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { Observable } from "rxjs";
import { Config } from "../config";
import { CaptainEntity } from "../entities/entity.captain";
import { IslandEntity } from "../entities/entity.island";
import { ShipEntity } from "../entities/entity.ship";

//-----------------------------
export interface SignInOrUpRequest {
    user: string;
}

// TODO import ship, captain and island
export interface SignInOrUpResponse {
    ethAddress: string;
    nickname: string;
    worldX: number;
    worldY: number;
    nvy: number;
    aks: number;
    captains: CaptainEntity[];
    ships: ShipEntity[];
    islands: IslandEntity[];
    dailyPlayersKilledCurrent: number;
    dailyPlayersKilledMax: number;
    dailyBotsKilledCurrent: number;
    dailyBotsKilledMax: number;
    dailyBossesKilledCurrent: number;
    dailyBossesKilledMax: number;
}

//-----------------------------

export interface UserService {
    SignInOrUp(request: SignInOrUpRequest): Observable<SignInOrUpResponse>;
}

export const UserServiceName = 'UserService';
export const UserServiceGrpcClientName = 'UserService';
export const UserServiceGrpcPackage = 'userservice';

export const UserServiceGrpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: 'localhost:' + Config.USER_SERVICE_PORT,
        package: UserServiceGrpcPackage,
        protoPath: join(__dirname, '../../proto/user.service.proto'),
    },
};