/* eslint-disable prettier/prettier */
import { NotificationType } from '@app/shared-library/gprc/grpc.notification.service';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {

    @Prop()
    walletAddress: string;

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