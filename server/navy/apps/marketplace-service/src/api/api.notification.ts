import {
    NotificationService,
    NotificationServiceGrpcClientName,
    NotificationServiceName
} from "@app/shared-library/gprc/grpc.notification.service";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class NotificationApiService implements OnModuleInit {

    private notificationService: NotificationService;

    constructor(@Inject(NotificationServiceGrpcClientName) private readonly notificationServiceGrpcClient: ClientGrpc) {
    }

    onModuleInit() {
        this.notificationService = this.notificationServiceGrpcClient.getService<NotificationService>(NotificationServiceName);
    }

    async getNotifications(walletAddress: string) {
        const signUpResult = await lastValueFrom(this.notificationService.GetUserNotifications({
            walletAddress
        }));
        return signUpResult;
    }

    async readNotifications(walletAddress: string) {
        const signUpResult = await lastValueFrom(this.notificationService.ReadUserNotifications({
            walletAddress
        }));
    }
}