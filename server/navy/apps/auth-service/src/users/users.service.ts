import { UserServiceGrpcClientName, UserService, UserServiceName, SignUpRequest, FindUserRequest } from '@app/shared-library/gprc/grpc.user.service';
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

    signUp(request: SignUpRequest) {
        console.log('signUp');
        return lastValueFrom(this.userService.SignUp(request));
    }

    findUser(request: FindUserRequest) {
        console.log('findUser');
        return lastValueFrom(this.userService.FindUser(request));
    }

}