import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { Observable } from "rxjs";
import { Config } from "../config";

export interface NotificationService {
    SendEmail(request: SendEmailRequest): Observable<SendEmailResponse>;
    GetUserNotifications(request: GetUserNotificationsRequest): Observable<GetUserNotificationsResponse>;
    ReadUserNotifications(request: ReadUserNotificationsRequest): Observable<ReadUserNotificationsResponse>;
}

//-----------------------------
// SendEmail
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
// GetUserNotifications
//-----------------------------

export enum NotificationType {
    NFT_MINTED = 0,
    NFT_SOLD = 1
}

export interface UserNotification {
    type: NotificationType;
    message: string;
    date: string;
    read: boolean;
}

export interface GetUserNotificationsRequest {
    walletAddress: string;
}

export interface GetUserNotificationsResponse {
    notifications: UserNotification[];
}

//-----------------------------
// ReadUserNotifications
//-----------------------------

export interface ReadUserNotificationsRequest {
    walletAddress: string;
}

export interface ReadUserNotificationsResponse {
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