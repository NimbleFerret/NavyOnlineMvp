import {
    NotificationServiceGrpcClientName,
    NotificationServiceGrpcClientOptions
} from '@app/shared-library/gprc/grpc.notification.service';
import {
    UserProfile,
    UserProfileSchema
} from '@app/shared-library/schemas/schema.user.profile';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfirmationModule } from '../confirmation/confirmation.module';
import { AuthService } from './auth.service';

@Module({
    imports: [
        ConfirmationModule,
        MongooseModule.forFeature([
            { name: UserProfile.name, schema: UserProfileSchema },
        ]),
        ClientsModule.register([
            {
                name: NotificationServiceGrpcClientName,
                ...NotificationServiceGrpcClientOptions,
            },
        ])
    ],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule { }