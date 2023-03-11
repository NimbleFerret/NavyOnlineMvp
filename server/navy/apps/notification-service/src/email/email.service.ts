import { GetUserNotificationsRequest, ReadUserNotificationsRequest, SendEmailRequest, SendEmailResponse } from '@app/shared-library/gprc/grpc.notification.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const nodemailer = require("nodemailer");

@Injectable()
export class EmailService {

    private transporter: any;
    private senderEmail: string;

    constructor(configService: ConfigService) {
        this.senderEmail = configService.get<string>('EMAIL_USER_LOGIN');
        this.transporter = nodemailer.createTransport({
            host: configService.get<string>('SMTP_HOST'),
            port: configService.get<number>('SMTP_PORT'),
            secure: true,
            auth: {
                user: this.senderEmail,
                pass: configService.get<string>('EMAIL_USER_PASSWORD')
            },
        });
    }

    async sendEmail(request: SendEmailRequest) {
        const response = {
            success: false
        } as SendEmailResponse;
        try {
            await this.transporter.sendMail({
                from: this.senderEmail,
                to: request.recipient,
                subject: request.subject,
                html: `<b>${request.message}</b>`
            });
            response.success = true;
            Logger.log('Email sent to ' + request.recipient);
        } catch (err) {
            Logger.error('Unable to send email to ' + request.recipient, err);
        }
        return response;
    }

}
