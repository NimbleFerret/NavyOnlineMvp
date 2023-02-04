import { FindUserResponse } from '@app/shared-library/gprc/grpc.user.service';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Constants } from '../app.constants';

const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async issueAuthTokenForUser(email: string, password: string) {
        const user = await this.validateUser(email, password);
        const data = { email: user.email, id: user.id };
        return jwt.sign({ data }, Constants.jwtSecret, { expiresIn: '1h' });
    }

    async verifyAuthToken(token: string) {
        try {
            jwt.verify(token, Constants.jwtSecret);
            return {
                success: true
            }
        } catch (err) {
            return {
                success: false
            }
        }
    }

    private async validateUser(email: string, password: string): Promise<FindUserResponse | null> {
        const user = await this.usersService.findUser({ email });
        if (user && user.password === password) {
            return user;
        }
        return null;
    }

}