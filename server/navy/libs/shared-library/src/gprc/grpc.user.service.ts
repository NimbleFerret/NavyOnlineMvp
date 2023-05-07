import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { Observable } from "rxjs";
import { Config } from "../config";
// import { CaptainEntity } from "../entities/entity.captain";
import { IslandEntity } from "../entities/entity.island";
import { ShipEntity } from "../entities/entity.ship";

//-----------------------------

export enum SignUpState {
    WAITING_FOR_EMAIL_CONFIRMATION,
    DONE
}

export interface SignUpRequest {
    email: string;
    password: string;
    password2: string;
    confirmationCode: string;
    ethAddress: string;
    signedMessage: string;
}

export interface SignUpResponse {
    success: boolean;
    reasonCode: number;
    userId: string;
    signUpState: SignUpState;
}

//-----------------------------

export enum AttachOperation {
    ATTACH_EMAIL,
    ATTACH_ETH_ADDRESS
}

export interface AttachEmailOrEthAddressRequest {
    operation: AttachOperation;
    email: string;
    ethAddress: string;
}

export interface AttachEmailOrEthAddressResponse {
    success: boolean;
    reasonCode: number;
}

//-----------------------------

// TODO import ship, captain and island
export interface SignInOrUpResponse {
    ethAddress: string;
    nickname: string;
    worldX: number;
    worldY: number;
    nvy: number;
    aks: number;
    // captains: CaptainEntity[];
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

export interface FindUserRequest {
    email: string;
    ethAddress: string;
}

export interface FindUserResponse {
    success: boolean;
    id: string;
    email: string;
    password: string;
    ethAddress: string;
    nickname: string;
}

//-----------------------------

export interface GetUserPosRequest {
    user: string;
}

export interface GetUserPosResponse {
    x: number;
    y: number;
}

//-----------------------------

export interface GenerateOneTimeEmailCodeRequest {
    email: string;
}

export interface GenerateOneTimeEmailCodeResponse {
    success: boolean;
}

export interface CheckOneTimeEmailCodeRequest {
    email: string;
    code: string;
}

export interface CheckOneTimeEmailCodeResponse {
    success: boolean;
    attemptsLeft: number;
}

//-----------------------------

export interface UserService {
    SignUp(request: SignUpRequest): Observable<SignUpResponse>;
    AttachEmailOrEthAddress(request: AttachEmailOrEthAddressRequest): Observable<AttachEmailOrEthAddressResponse>;
    GenerateOneTimeEmailCode(request: GenerateOneTimeEmailCodeRequest): Observable<GenerateOneTimeEmailCodeResponse>;
    CheckOneTimeEmailCode(request: CheckOneTimeEmailCodeRequest): Observable<CheckOneTimeEmailCodeResponse>;
    FindUser(request: FindUserRequest): Observable<FindUserResponse>;
    GetUserPos(request: GetUserPosRequest): Observable<GetUserPosResponse>;
}

export const UserServiceName = 'UserService';
export const UserServiceGrpcClientName = 'UserService';
export const UserServiceGrpcPackage = 'userservice';

export const UserServiceGrpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: (Config.TestEnv ? 'localhost' : 'navy-user-service') + Config.USER_SERVICE_PORT,
        package: UserServiceGrpcPackage,
        protoPath: join(__dirname, '../../proto/user.service.proto'),
    },
};