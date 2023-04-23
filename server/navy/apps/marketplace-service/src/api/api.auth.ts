import { SharedLibraryService } from "@app/shared-library";
import { IssueTokenResponse, VerifyTokenRequest } from "@app/shared-library/gprc/grpc.auth.service";
import {
    AttachEmailOrEthAddressRequest,
    AttachEmailOrEthAddressResponse,
    AttachOperation,
    FindUserRequest,
    FindUserResponse,
    SignUpRequest,
    SignUpResponse,
    SignUpState
} from "@app/shared-library/gprc/grpc.user.service";
import { CheckEthersAuthSignatureResponse } from "@app/shared-library/gprc/grpc.web3.service";
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ethers } from 'ethers';
import { Constants } from "apps/web3-service/src/app.constants";
import { EmailState, UserProfile, UserProfileDocument } from "@app/shared-library/schemas/schema.user.profile";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthUpdateDto } from "apps/gateway-service/src/dto/app.dto";
import * as EmailValidator from 'email-validator';

const jwt = require('jsonwebtoken');

@Injectable()
export class AuthApiService {

    private readonly logger = new Logger(AuthApiService.name);
    private readonly jwtSecret = 'replace_me_asap';

    constructor(@InjectModel(UserProfile.name) private userProfileModel: Model<UserProfileDocument>) {
    }

    // ------------------------------------------------
    // Public api
    // ------------------------------------------------

    async authSignUp(request: SignUpRequest) {
        const response = {
            success: false
        };
        if (await this.checkEthersAuthSignatureIfNeeded(request)) {
            const signUpResult = await this.signUp(request);
            if (!signUpResult.success) {
                if (!response.success) {
                    throw new HttpException('Reason: ' + signUpResult.reasonCode, HttpStatus.UNAUTHORIZED);
                }
            } else {
                response.success = true;
                if (signUpResult.signUpState == SignUpState.DONE) {
                    const issueTokenResult = await this.issueToken(signUpResult.userId);
                    response['token'] = issueTokenResult.token;
                    response['userId'] = signUpResult.userId
                } else {
                    response['signUpState'] = SignUpState.WAITING_FOR_EMAIL_CONFIRMATION;
                }
            }
        }
        return response;
    }

    async authSignIn(request: SignUpRequest) {
        const response = {
            success: false
        };
        if (await this.checkEthersAuthSignatureIfNeeded(request)) {
            const findUserResult = await this.findUser({ email: request.email, ethAddress: request.ethAddress });
            if (findUserResult.success) {
                if (request.email && findUserResult.password == request.password || request.ethAddress) {
                    const issueTokenResult = await this.issueToken(findUserResult.id);
                    response.success = true;
                    response['token'] = issueTokenResult.token;
                }
            }
        }
        if (!response.success) {
            throw new HttpException('Bad auth', HttpStatus.UNAUTHORIZED);
        }
        return response;
    }

    async authUpdate(request: AuthUpdateDto) {
        const response = {
            success: false
        };

        let continueAuthUpdate = true;

        if (request.operation == AttachOperation.ATTACH_ETH_ADDRESS && request.ethAddress && request.signedMessage && request.email) {
            const checkSignatureResult = await this.checkEthersAuthSignature(request.ethAddress, request.signedMessage);
            if (!checkSignatureResult.success) {
                continueAuthUpdate = false;
                response['reasonCode'] = SharedLibraryService.GENERAL_ERROR;
                this.logger.error(`signUp failed for ${request.ethAddress}, bad signature!`);
            }
        }

        const attachResult = await this.attachEmailOrEthAddress({
            operation: request.operation,
            email: request.email,
            ethAddress: request.ethAddress
        });

        if (attachResult.success) {
            response.success = true;
        } else {
            response['reasonCode'] = attachResult.reasonCode;
        }

        return response;
    }

    async verifyToken(request: VerifyTokenRequest) {
        try {
            jwt.verify(request.token, this.jwtSecret);
            return {
                success: true
            }
        } catch (err) {
            return {
                success: false
            }
        }
    }

    // ------------------------------------------------
    // Common
    // ------------------------------------------------

    private async checkEthersAuthSignatureIfNeeded(request: SignUpRequest) {
        const response = {
            success: false
        };
        let continueAuth = true;

        if (request.ethAddress && request.signedMessage && !request.email && !request.password) {
            const isMessageSignOk = await this.checkEthersAuthSignature(request.ethAddress, request.signedMessage);
            if (!isMessageSignOk.success) {
                continueAuth = false;
                response['reasonCode'] = SharedLibraryService.GENERAL_ERROR;
                this.logger.error(`signUp failed for ${request.ethAddress}, bad signature!`);
            }
        }

        return continueAuth;
    }

    private async checkEthersAuthSignature(address: string, signedMessage: string) {
        const signerAddr = ethers.utils.verifyMessage(Constants.AuthSignatureTemplate.replace('@', address), signedMessage)
        return {
            success: signerAddr == address
        } as CheckEthersAuthSignatureResponse;
    }

    private async signUp(request: SignUpRequest) {
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
                if (request.password != request.password2) {
                    this.logger.error(`signUp failed. Passwords does not match`);
                    response.reasonCode = SharedLibraryService.BAD_PARAMS;
                    return response;
                }

                request.email = request.email.toLowerCase();

                const user = await this.userProfileModel.findOne({
                    email: request.email
                });

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
            } else {
                this.logger.error(`signUp failed. Bad params: ${request.ethAddress} | (${request.email} / ${request.password})`);
                response.reasonCode = SharedLibraryService.BAD_PARAMS;
            }
        }

        return response;
    }

    private async attachEmailOrEthAddress(request: AttachEmailOrEthAddressRequest) {
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

    private async issueToken(userId: string) {
        const data = { userId };
        const tokenResult = {
            token: jwt.sign({ data }, this.jwtSecret)
        } as IssueTokenResponse;

        const userPorfile = await this.userProfileModel.findById(userId);
        userPorfile.authToken = tokenResult.token;
        userPorfile.save();

        return tokenResult;
    }

    private async findUser(request: FindUserRequest) {
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