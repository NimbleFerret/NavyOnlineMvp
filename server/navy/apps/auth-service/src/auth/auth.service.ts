import { Injectable } from '@nestjs/common';
import { Constants } from '../app.constants';
import { IssueTokenRequest, IssueTokenResponse, VerifyTokenRequest } from '@app/shared-library/gprc/grpc.auth.service';

const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
    constructor() { }

    issueToken(request: IssueTokenRequest) {
        const data = { userId: request.userId };
        return {
            token: jwt.sign({ data }, Constants.jwtSecret, { expiresIn: '1h' })
        } as IssueTokenResponse;
    }

    verifyToken(request: VerifyTokenRequest) {
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

}