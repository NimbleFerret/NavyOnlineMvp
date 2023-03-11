import {
    GetUserNotificationsRequest,
    GetUserNotificationsResponse,
    ReadUserNotificationsRequest,
    UserNotification
} from '@app/shared-library/gprc/grpc.notification.service';
import { Notification, NotificationDocument } from '@app/shared-library/schemas/marketplace/schema.notification';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationService implements OnModuleInit {

    constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {
    }

    async onModuleInit() {
        // const n = new this.notificationModel();
        // n.walletAddress = '123';
        // n.notificationType = NotificationType.NFT_MINTED;
        // n.message = 'This is my first notification';
        // await n.save();
    }

    async getUserNotifications(request: GetUserNotificationsRequest) {
        const notifications = (await this.notificationModel.find({
            walletAddress: request.walletAddress
        }).select(['-_id', '-__v']).sort([['date', -1]])).map(notification => {
            return {
                type: notification.notificationType,
                message: notification.message,
                date: String(notification.date.getTime()),
                read: notification.read
            } as UserNotification;
        });
        return {
            notifications
        } as GetUserNotificationsResponse;
    }

    async readUserNotifications(request: ReadUserNotificationsRequest) {
        const userNotifications = await this.notificationModel.find({
            walletAddress: request.walletAddress,
            read: false
        });

        for (const notification of userNotifications) {
            notification.read = true;
            await notification.save();
        }
    }

}
