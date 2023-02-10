import { SharedLibraryService } from '@app/shared-library';
import {
    NotificationService,
    NotificationServiceGrpcClientName,
    NotificationServiceName
} from '@app/shared-library/gprc/grpc.notification.service';
import {
    SignUpRequest,
    SignUpResponse,
    AttachEmailOrEthAddressRequest,
    AttachEmailOrEthAddressResponse,
    FindUserRequest,
    FindUserResponse,
    SignUpState
} from '@app/shared-library/gprc/grpc.user.service';
import { EmailState, UserProfile, UserProfileDocument } from '@app/shared-library/schemas/schema.user.profile';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { ConfirmationResult, ConfirmationService } from '../confirmation/confirmation.service';
import * as EmailValidator from 'email-validator';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);
    private readonly emailCodeConfirmationActive = true;
    private readonly signUpConfirmationEmailSubject = 'Navy.online authentication';
    private readonly signUpConfirmationEmailText = 'Please enter following code in order to sign up: @';

    private notificationService: NotificationService;

    constructor(
        private readonly confirmationService: ConfirmationService,
        @InjectModel(UserProfile.name) private userProfileModel: Model<UserProfileDocument>,
        @Inject(NotificationServiceGrpcClientName) private readonly notificationServiceGrpcClient: ClientGrpc
    ) { }

    async onModuleInit() {
        this.notificationService = this.notificationServiceGrpcClient.getService<NotificationService>(NotificationServiceName);
    }

    async signUp(request: SignUpRequest) {
        const response = {
            success: false,
        } as SignUpResponse;

        if (request.email && request.ethAddress) {
            this.logger.error(`signUp failed for ${request.email} / ${request.ethAddress}, impossible to signUp by both identifiers!`);
            response.reasonCode = SharedLibraryService.BAD_PARAMS;
        } else {
            if (request.ethAddress) {
                const user = await this.userProfileModel.findOne({
                    ethAddress: request.ethAddress
                });
                if (user) {
                    this.logger.error(`signUp failed for ${request.ethAddress}, user already exists!`);
                    response.reasonCode = SharedLibraryService.ALREADY_EXISTS_ERROR;
                } else {
                    const userModel = new this.userProfileModel({
                        ethAddress: request.ethAddress
                    });
                    await userModel.save();
                    response.success = true;
                    response.signUpState = SignUpState.DONE;
                    response.userId = userModel._id;
                }
            } else if (request.email && request.password && EmailValidator.validate(request.email)) {
                request.email = request.email.toLowerCase();

                const user = await this.userProfileModel.findOne({
                    email: request.email
                });

                if (this.emailCodeConfirmationActive) {
                    if (!user) {
                        const userModel = new this.userProfileModel({
                            email: request.email,
                            password: request.password,
                            emailState: EmailState.WAITING_FOR_CONFIRMATION
                        });
                        await userModel.save();

                        const generatedCode = await this.confirmationService.generateNewCode(request.email);
                        const sendEmailResult = await lastValueFrom(this.notificationService.SendEmail({
                            recipient: request.email,
                            subject: this.signUpConfirmationEmailSubject,
                            message: this.signUpConfirmationEmailText.replace('@', generatedCode.code)
                        }));

                        if (sendEmailResult.success) {
                            response.success = true;
                            response.signUpState = SignUpState.WAITING_FOR_EMAIL_CONFIRMATION;
                        } else {
                            this.logger.error('Unable to generate signUp email code for email ' + request.email);
                            response.reasonCode = SharedLibraryService.UNABLE_TO_GENERATE_CONFIRMATION_CODE;
                        }
                    } else {
                        if (user.emailState == EmailState.WAITING_FOR_CONFIRMATION) {
                            if (request.email && request.confirmationCode) {
                                const confirmationResult = await this.confirmationService.checkCode(request.email, request.confirmationCode);
                                if (confirmationResult == ConfirmationResult.MATCH) {
                                    user.emailState = EmailState.CONFIRMED;
                                    await user.save();

                                    response.success = true;
                                    response.signUpState = SignUpState.DONE;
                                    response.userId = user._id;
                                } else if (confirmationResult == ConfirmationResult.MISSMATCH) {
                                    response.reasonCode = SharedLibraryService.CONFIRMATION_CODE_MISSMATCH;
                                } else {
                                    response.reasonCode = SharedLibraryService.CONFIRMATION_CODE_EXPIRED;
                                }
                            } else {
                                response.reasonCode = SharedLibraryService.BAD_PARAMS;
                            }
                        } else {
                            response.reasonCode = SharedLibraryService.GENERAL_ERROR;
                        }
                    }
                } else {
                    if (user) {
                        this.logger.error(`signUp failed for ${request.email}, user already exists!`);
                        response.reasonCode = SharedLibraryService.ALREADY_EXISTS_ERROR;
                    } else {
                        const userModel = new this.userProfileModel({
                            email: request.email,
                            password: request.password,
                            emailState: EmailState.CONFIRMED
                        });

                        await userModel.save();
                        response.success = true;
                        response.signUpState = SignUpState.DONE;
                        response.userId = userModel._id;
                    }
                }
            } else {
                this.logger.error(`signUp failed. Bad params: ${request.ethAddress} | (${request.email} / ${request.password})`);
                response.reasonCode = SharedLibraryService.BAD_PARAMS;
            }
        }

        return response;
    }

    async attachEmailOrEthAddress(request: AttachEmailOrEthAddressRequest) {
        const response = {
            success: false
        } as AttachEmailOrEthAddressResponse;
        const findQuery = request.email ? { email: request.email } : { ethAddress: request.ethAddress };
        const user = await this.userProfileModel.findOne(findQuery);
        if (user) {
            response.success = true;
        } else {
            response.reasonCode = SharedLibraryService.GENERAL_ERROR;
        }
        return response;
    }

    async findUser(request: FindUserRequest) {
        const response = {
            success: false
        } as FindUserResponse;
        const findQuery = request.email ? { email: request.email } : { ethAddress: request.ethAddress };
        const user = await this.userProfileModel.findOne(findQuery);
        if (user) {
            response.success = true;
            response.id = user.id;
            response.email = user.email;
            response.password = user.password;
            response.ethAddress = user.nickname;
            response.nickname = user.ethAddress;
        }
        return response;
    }

}