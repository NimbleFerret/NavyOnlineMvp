import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { Observable } from "rxjs";
import { Config } from "../config";

export interface NotificationService {
    SendEmail(request: SendEmailRequest): Observable<SendEmailResponse>;
}

//-----------------------------

export interface SendEmailRequest {
    recipient: string;
    subject: string;
    message: string;
}

export interface SendEmailResponse {
    success: boolean;
}

//-----------------------------

export const NotificationServiceName = 'NotificationService';
export const NotificationServiceGrpcClientName = 'NotificationService';
export const NotificationServiceGrpcPackage = 'notificationservice';

export const NotificationServiceGrpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: 'localhost:' + Config.NOTIFICATION_SERVICE_PORT,
        package: NotificationServiceGrpcPackage,
        protoPath: join(__dirname, '../../proto/notification.service.proto'),
    },
};