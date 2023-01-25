import { UserAuth } from '@app/shared-library/schemas/schema.auth';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from '../app.service';

@Injectable()
export class AuthService {
    constructor(
        private appService: AppService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<UserAuth | null> {
        const user = await this.appService.findUserByEmail(email);
        if (user && user.password === pass) {
            return user;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}