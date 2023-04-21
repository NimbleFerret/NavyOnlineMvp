/* eslint-disable prettier/prettier */
import { NotificationType } from '@app/shared-library/gprc/grpc.notification.service';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserProfileDocument } from '../schema.user.profile';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' })
    userProfile: UserProfileDocument;

    @Prop({
        type: Number,
        required: true,
        enum: [
            NotificationType.NFT_MINTED,
            NotificationType.NFT_SOLD
        ]
    })
    notificationType: NotificationType;

    @Prop({ default: false })
    read: boolean;

    @Prop()
    message: string;

    @Prop({ type: Date, default: Date.now })
    date: Date

}

export const NotificationSchema = SchemaFactory.createForClass(Notification);