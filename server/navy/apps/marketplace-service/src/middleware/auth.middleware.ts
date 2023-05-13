import {
    Injectable,
    NestMiddleware,
    UnauthorizedException
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthApiService } from '../api/api.auth';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(private readonly authApiService: AuthApiService) {
    }

    async use(req: Request, res: Response, next: NextFunction) {
        res.statusCode = 401;
        if (req.headers.authorization) {
            const authHeader = req.headers.authorization.split(' ');
            if (authHeader.length == 2 && authHeader[0] == 'Bearer') {
                const result2 = await this.authApiService.verifyToken(authHeader[1]);
                if (result2.success) {
                    res.statusCode = 200;
                }
            }
        }
        if (res.statusCode == 200) {
            next();
        } else {
            throw new UnauthorizedException();
        }
    }
}
