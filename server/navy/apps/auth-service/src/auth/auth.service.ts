import { FindUserResponse, SignUpRequest } from '@app/shared-library/gprc/grpc.user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { request } from 'http';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string): Promise<FindUserResponse | null> {
        console.log('validateUser');
        const user = await this.usersService.findUser({ email });
        if (user && user.password === password) {
            return user;
        }
        return null;
    }

    async signIn(email: string, password: string) {
        console.log('signIn');
        const validatedUser = await this.validateUser(email, password);

        if (validatedUser) {
            const payload = { email: validatedUser.email, id: validatedUser.id };
            return {
                success: true,
                access_token: this.jwtService.sign(payload),
            };
        } else {
            return {
                success: false
            }
        }


    }

    async signUp(request: SignUpRequest) {
        const signUpResult = await this.usersService.signUp(request);
        if (signUpResult.success) {
            const user = await this.usersService.findUser({ email: request.email });
            const payload = { email: user.email, id: user.id };
            return {
                success: true,
                access_token: this.jwtService.sign(payload),
            };
        } else {
            return {
                success: false,
                reason: signUpResult.reasonCode
            };
        }

    }
}