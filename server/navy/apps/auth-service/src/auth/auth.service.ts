import { UserAuth } from '@app/shared-library/schemas/schema.auth';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDTO } from '../app.controller';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<UserAuth | null> {
        const user = await this.usersService.findUserByEmail(email);
        if (user && user.password === pass) {
            return user;
        }
        return null;
    }

    async signIn(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async signUp(signUpDTO: SignUpDTO) {
    }
}