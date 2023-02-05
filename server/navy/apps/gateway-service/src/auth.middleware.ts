
import { Injectable, NestMiddleware, OnModuleInit } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware, OnModuleInit {

    onModuleInit() {
        throw new Error('Method not implemented.');
    }

    use(req: Request, res: Response, next: NextFunction) {
        console.log('Headers:');

        if (req.headers.authorization) {
            const authHeader = req.headers.authorization.split(' ');
            if (authHeader.length == 2 && authHeader[0] == 'Bearer') {
                console.log(authHeader[1]);
                // TODO test token somehow...
            } else {
                console.log('STOP');
            }
        } else {
            // TODO impl error
        }

        next();
    }
}
