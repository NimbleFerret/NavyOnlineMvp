import { UserNotification, GetUserNotificationsResponse } from "@app/shared-library/gprc/grpc.notification.service";
import { Notification, NotificationDocument } from "@app/shared-library/schemas/marketplace/schema.notification";
import { UserProfile, UserProfileDocument } from "@app/shared-library/schemas/schema.user.profile";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class NotificationApiService {

    constructor(
        @InjectModel(UserProfile.name) private userProfileModel: Model<UserProfileDocument>,
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {
    }

    async getNotifications(authToken: string) {
        const userProfile = await this.getUserProfileByAuthToken(authToken);
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
        const userProfile = await this.getUserProfileByAuthToken(authToken);
        const userNotifications = await this.notificationModel.find({
            userProfile,
            read: false
        });
        for (const notification of userNotifications) {
            notification.read = true;
            await notification.save();
        }
    }

    private async getUserProfileByAuthToken(authToken: string) {
        return await this.userProfileModel.findOne({
            authToken
        });
    }
}