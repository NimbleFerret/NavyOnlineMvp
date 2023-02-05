import { FindUserResponse } from '@app/shared-library/gprc/grpc.user.service';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Constants } from '../app.constants';
import { IssueTokenRequest, IssueTokenResponse, VerifyTokenRequest } from '@app/shared-library/gprc/grpc.auth.service';

const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async issueToken(request: IssueTokenRequest) {
        const user = await this.validateUser(request.email, request.password);
        const data = { email: user.email, id: user.id };
        return {
            token: jwt.sign({ data }, Constants.jwtSecret, { expiresIn: '1h' })
        } as IssueTokenResponse
    }

    async verifyToken(request: VerifyTokenRequest) {
        try {
            jwt.verify(request.token, Constants.jwtSecret);
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