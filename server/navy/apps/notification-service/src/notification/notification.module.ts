import { Module } from '@nestjs/common';
import { Notification, NotificationSchema } from '@app/shared-library/schemas/marketplace/schema.notification';
import { NotificationService } from './notification.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Notification.name, schema: NotificationSchema },
        ]),
    ],
    providers: [NotificationService],
    exports: [NotificationService]
})
export class NotificationModule { }
