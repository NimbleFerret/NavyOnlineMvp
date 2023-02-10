import { NotificationServiceName, SendEmailRequest } from '@app/shared-library/gprc/grpc.notification.service';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { EmailService } from './email/email.service';

@Controller()
export class AppController {
  constructor(private readonly emailService: EmailService) { }

  @GrpcMethod(NotificationServiceName)
  sendEmail(request: SendEmailRequest) {
    return this.emailService.sendEmail(request);
  }
}
