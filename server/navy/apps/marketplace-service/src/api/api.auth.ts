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
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ethers } from 'ethers';
import { Constants } from "apps/web3-service/src/app.constants";
import { EmailState, UserProfile, UserProfileDocument } from "@app/shared-library/schemas/schema.user.profile";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AttachEmailDto, AttachWalletDto, UpdatePasswordDto } from "apps/gateway-service/src/dto/app.dto";
import * as EmailValidator from 'email-validator';
import { Utils } from "@app/shared-library/utils";

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

    async signInOrUp(signIn: boolean, request: SignUpRequest) {
        const response = {
            success: true
        };

        let reason = undefined;
        let httpStatus = undefined;

        if (request.ethAddress && request.signedMessage) {
            await this.checkEthersAuthSignature(request.ethAddress, request.signedMessage);
            if (signIn) {
                const userProfile = await this.userProfileModel.findOne({ ethAddress: request.ethAddress });
                if (userProfile) {
                    const issueTokenResult = await this.issueToken(userProfile.id);
                    response.success = true;
                    response['token'] = issueTokenResult.token;
                    response['ethAddress'] = request.ethAddress;
                    if (userProfile.email) {
                        response['email'] = userProfile.email;
                    }
                } else {
                    response.success = false;
                    reason = Utils.ERROR_WALLET_NOT_FOUND;
                    httpStatus = HttpStatus.BAD_REQUEST;
                }
            } else {
                const signUpResult = await this.trySignUp(request);
                if (!signUpResult.success) {
                    response.success = false;
                    response['ethAddress'] = request.ethAddress;
                    reason = signUpResult.reason;
                    httpStatus = HttpStatus.BAD_REQUEST;
                } else {
                    const issueTokenResult = await this.issueToken(signUpResult.userId);
                    response['token'] = issueTokenResult.token;
                    response['ethAddress'] = request.ethAddress;
                }
            }
        } else if (request.email && request.password) {
            if (signIn) {
                const userProfile = await this.userProfileModel.findOne({ email: request.email });
                if (userProfile) {
                    if (userProfile.password == request.password) {
                        const issueTokenResult = await this.issueToken(userProfile.id);
                        response.success = true;
                        response['token'] = issueTokenResult.token;
                        response['email'] = request.email;
                        if (userProfile.email) {
                            response['ethAddress'] = userProfile.ethAddress;
                        }
                    } else {
                        response.success = false;
                        reason = Utils.ERROR_BAD_EMAIL_OR_PASSWORD;
                        httpStatus = HttpStatus.BAD_REQUEST;
                    }
                } else {
                    response.success = false;
                    reason = Utils.ERROR_EMAIL_NOT_FOUND;
                    httpStatus = HttpStatus.BAD_REQUEST;
                }
            } else {
                const signUpResult = await this.trySignUp(request);
                if (!signUpResult.success) {
                    response.success = false;
                    reason = signUpResult.reason;
                    httpStatus = HttpStatus.BAD_REQUEST;
                } else {
                    const issueTokenResult = await this.issueToken(signUpResult.userId);
                    response['token'] = issueTokenResult.token;
                    response['email'] = request.email;
                }
            }
        } else {
            response.success = false;
            reason = Utils.ERROR_BAD_PARAMS;
            httpStatus = HttpStatus.BAD_REQUEST;
        }

        if (!response.success) {
            throw new HttpException({
                success: false,
                reason
            }, httpStatus);
        }

        return response;
    }

    async attachEmail(authToken: string, dto: AttachEmailDto) {
        const userProfile = await this.checkTokenAndGetProfile(authToken);

        let success = true;
        let reason = undefined;
        let httpStatus = undefined;

        if (await this.emailExists(dto.email)) {
            success = false;
            reason = Utils.ERROR_EMAIL_EXISTS;
            httpStatus = HttpStatus.BAD_GATEWAY;
        }
        if ((!userProfile.email || userProfile.email.length == 0) && dto.password.length < 6) {
            success = false;
            reason = Utils.ERROR_BAD_EMAIL_OR_PASSWORD;
            httpStatus = HttpStatus.BAD_REQUEST;
        }
        if (!success) {
            throw new HttpException({
                success,
                reason
            }, httpStatus);
        }

        if ((!userProfile.email || userProfile.email.length == 0) && dto.password.length < 6) {
            userProfile.email = dto.email;
            userProfile.password = dto.password;
            await userProfile.save();
            return {
                success: true,
                ethAddress: userProfile.ethAddress,
                email: userProfile.email
            }
        }
    }

    async attachWallet(authToken: string, dto: AttachWalletDto) {
        const userProfile = await this.checkTokenAndGetProfile(authToken);
        dto.ethAddress = dto.ethAddress.toLowerCase();
        await this.checkEthersAuthSignature(dto.ethAddress, dto.signedMessage);

        if (await this.walletExists(dto.ethAddress)) {
            throw new HttpException({
                reason: Utils.ERROR_WALLET_EXISTS
            }, HttpStatus.BAD_GATEWAY);
        }

        userProfile.ethAddress = dto.ethAddress;
        await userProfile.save();
        return {
            success: true,
            ethAddress: userProfile.ethAddress,
            email: userProfile.email
        }
    }

    async updatePassword(authToken: string, dto: UpdatePasswordDto) {
        const userProfile = await this.checkTokenAndGetProfile(authToken);

        if (userProfile.password == dto.newPassword ||
            userProfile.password != dto.currentPassword ||
            dto.currentPassword == dto.newPassword ||
            dto.newPassword.length < 5) {
            throw new HttpException({
                success: false,
                reason: Utils.ERROR_BAD_EMAIL_OR_PASSWORD
            }, HttpStatus.BAD_REQUEST);
        }

        userProfile.password = dto.newPassword;
        await userProfile.save();

        return {
            success: true
        }
    }

    async logout(authToken: string) {
        const userProfile = await this.checkTokenAndGetProfile(authToken)
        userProfile.authToken = '';
        await userProfile.save();
    }

    async verifyToken(userAuthToken: string) {
        try {
            const userProfile = await this.getUserProfileByAuthToken(userAuthToken);
            const authToken = userProfile.authToken;
            if (authToken && authToken.length > 0) {
                jwt.verify(authToken, this.jwtSecret);
                return {
                    success: true,
                    userProfile
                }
            } else {
                return {
                    success: false
                }
            }
        } catch (err) {
            return {
                success: false
            }
        }
    }

    public async checkTokenAndGetProfile(authToken: string) {
        const result = await this.verifyToken(authToken);
        if (result && result.success && result.userProfile) {
            return result.userProfile;
        } else {
            throw new HttpException('Bad auth', HttpStatus.UNAUTHORIZED);
        }
    }

    // ------------------------------------------------
    // Common
    // ------------------------------------------------

    private async checkEthersAuthSignature(address: string, signedMessage: string) {
        const signerAddr = ethers.utils.verifyMessage(Constants.AuthSignatureTemplate.replace('@', address), signedMessage);
        if (signerAddr != address) {
            throw new HttpException({
                success: false,
                reason: Utils.ERROR_BAD_SIGNATURE
            }, HttpStatus.BAD_REQUEST);
        }
    }

    private async trySignUp(request: SignUpRequest) {
        const response = {
            success: false,
            reason: '',
            userId: ''
        }

        if (request.email && request.ethAddress) {
            this.logger.error(`signUp failed for ${request.email} / ${request.ethAddress}, impossible to signUp by both identifiers!`);
            response.reason = Utils.ERROR_BAD_PARAMS;
        } else {
            if (request.ethAddress) {
                const user = await this.userProfileModel.findOne({
                    ethAddress: request.ethAddress
                });
                if (user) {
                    this.logger.error(`signUp failed for ${request.ethAddress}, user already exists!`);
                    response.reason = Utils.ERROR_WALLET_EXISTS;
                } else {
                    const userModel = new this.userProfileModel({
                        ethAddress: request.ethAddress,
                        emailState: EmailState.CONFIRMED
                    });
                    await userModel.save();
                    response.success = true;
                    response.userId = userModel.id;
                }
            } else if (request.email && request.password && EmailValidator.validate(request.email)) {
                request.email = request.email.toLowerCase();

                const user = await this.userProfileModel.findOne({
                    email: request.email
                });

                if (user) {
                    this.logger.error(`signUp failed for ${request.email}, user already exists!`);
                    response.reason = Utils.ERROR_EMAIL_EXISTS;
                } else {
                    const userModel = new this.userProfileModel({
                        email: request.email,
                        password: request.password,
                        emailState: EmailState.CONFIRMED
                    });

                    await userModel.save();
                    response.success = true;
                    response.userId = userModel.id;
                }
            } else {
                this.logger.error(`signUp failed. Bad params: ${request.ethAddress} | (${request.email} / ${request.password})`);
                response.reason = Utils.ERROR_BAD_PARAMS;
            }
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

    private async getUserProfileByAuthToken(authToken: string) {
        return await this.userProfileModel.findOne({
            authToken
        });
    }

    private async emailExists(email: string) {
        const profiles = await this.userProfileModel.count({
            email
        });
        return profiles > 0;
    }

    private async walletExists(ethAddress: string) {
        const profiles = await this.userProfileModel.count({
            ethAddress
        });
        return profiles > 0;
    }

}