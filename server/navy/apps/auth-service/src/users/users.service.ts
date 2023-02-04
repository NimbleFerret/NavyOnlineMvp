import {
    UserServiceGrpcClientName,
    UserService,
    UserServiceName,
    FindUserRequest
} from '@app/shared-library/gprc/grpc.user.service';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UsersService {

    private userService: UserService;

    constructor(@Inject(UserServiceGrpcClientName) private readonly userServiceGrpcClient: ClientGrpc) {
    }

    async onModuleInit() {
        this.userService = this.userServiceGrpcClient.getService<UserService>(UserServiceName);
    }

    findUser(request: FindUserRequest) {
        return lastValueFrom(this.userService.FindUser(request));
    }

}