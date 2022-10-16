import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { Observable } from "rxjs";
import { Config } from "../config";

//-----------------------------
export interface SignInOrUpRequest {
    user: string;
}

export interface SignInOrUpResponse {
}

//-----------------------------

export interface UserService {
    SignInOrUp(request: SignInOrUpRequest): Observable<SignInOrUpResponse>;
}

export const UserServiceName = 'UserService';
export const UserServiceGrpcPackage = 'userservice';

export const UserServiceGrpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: 'localhost:' + Config.USER_SERVICE_PORT,
        package: UserServiceGrpcPackage,
        protoPath: join(__dirname, '../../proto/user.service.proto'),
    },
};