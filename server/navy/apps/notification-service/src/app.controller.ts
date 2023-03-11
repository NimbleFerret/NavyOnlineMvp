import {
  GetUserNotificationsRequest,
  NotificationServiceName,
  ReadUserNotificationsRequest,
  SendEmailRequest
} from '@app/shared-library/gprc/grpc.notification.service';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { EmailService } from './email/email.service';
import { NotificationService } from './notification/notification.service';

@Controller()
export class AppController {
  constructor(
    private readonly emailService: EmailService,
    private readonly notificationService: NotificationService) { }

  @GrpcMethod(NotificationServiceName)
  sendEmail(request: SendEmailRequest) {
    return this.emailService.sendEmail(request);
  }

  @GrpcMethod(NotificationServiceName)
  getUserNotifications(request: GetUserNotificationsRequest) {
    return this.notificationService.getUserNotifications(request);
  }

  @GrpcMethod(NotificationServiceName)
  readUserNotifications(request: ReadUserNotificationsRequest) {
    return this.notificationService.readUserNotifications(request);
  }

}
