import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { Observable } from "rxjs";
import { Config } from "../config";

//-----------------------------

export interface IssueTokenRequest {
    userId: string;
}

export interface IssueTokenResponse {
    token: string;
}

export interface VerifyTokenRequest {
    token: string;
}

export interface VerifyTokenResponse {
    success: boolean;
}

//-----------------------------

export interface AuthService {
    IssueToken(request: IssueTokenRequest): Observable<IssueTokenResponse>;
    VerifyToken(request: VerifyTokenRequest): Observable<VerifyTokenResponse>;
}

export const AuthServiceName = 'AuthService';
export const AuthServiceGrpcClientName = 'AuthService';
export const AuthServiceGrpcPackage = 'authservice';

export const AuthServiceGrpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: 'localhost:' + Config.AUTH_SERVICE_PORT,
        package: AuthServiceGrpcPackage,
        protoPath: join(__dirname, '../../proto/auth.service.proto'),
    },
};