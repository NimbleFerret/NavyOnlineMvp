
import {
    AuthService,
    AuthServiceGrpcClientName,
    AuthServiceName
} from '@app/shared-library/gprc/grpc.auth.service';
import {
    Inject,
    Injectable,
    NestMiddleware,
    OnModuleInit,
    UnauthorizedException
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Request, Response, NextFunction } from 'express';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthMiddleware implements NestMiddleware, OnModuleInit {

    private authService: AuthService;

    constructor(@Inject(AuthServiceGrpcClientName) private readonly authServiceGrpcClient: ClientGrpc) {

    }

    async onModuleInit() {
        this.authService = this.authServiceGrpcClient.getService<AuthService>(AuthServiceName);
    }

    async use(req: Request, res: Response, next: NextFunction) {
        res.statusCode = 401;
        if (req.headers.authorization) {
            const authHeader = req.headers.authorization.split(' ');
            if (authHeader.length == 2 && authHeader[0] == 'Bearer') {
                const result2 = await lastValueFrom(this.authService.VerifyToken({ token: authHeader[1] }));
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
