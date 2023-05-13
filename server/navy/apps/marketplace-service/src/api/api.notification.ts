import { UserNotification, GetUserNotificationsResponse } from "@app/shared-library/gprc/grpc.notification.service";
import { Notification, NotificationDocument } from "@app/shared-library/schemas/marketplace/schema.notification";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthApiService } from "./api.auth";

@Injectable()
export class NotificationApiService {

    constructor(
        private readonly authService: AuthApiService,
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {
    }

    async getNotifications(authToken: string) {
        const userProfile = await this.authService.checkTokenAndGetProfile(authToken);
        const notifications = (await this.notificationModel.find({
            userProfile
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

    async readNotifications(authToken: string) {
        const userProfile = await this.authService.checkTokenAndGetProfile(authToken);
        const userNotifications = await this.notificationModel.find({
            userProfile,
            read: false
        });
        for (const notification of userNotifications) {
            notification.read = true;
            await notification.save();
        }
    }

}