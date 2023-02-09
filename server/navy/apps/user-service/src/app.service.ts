import { SharedLibraryService } from '@app/shared-library';
import { CaptainEntity } from '@app/shared-library/entities/entity.captain';
import { IslandEntity } from '@app/shared-library/entities/entity.island';
import { ShipEntity } from '@app/shared-library/entities/entity.ship';
import {
  GetUserPosRequest,
  GetUserPosResponse,
  SignUpRequest, SignUpResponse,
  FindUserRequest,
  FindUserResponse
} from '@app/shared-library/gprc/grpc.user.service';
import {
  Web3Service,
  Web3ServiceGrpcClientName,
  Web3ServiceName
} from '@app/shared-library/gprc/grpc.web3.service';
import { UserAvatar, UserAvatarDocument } from '@app/shared-library/schemas/schema.user.avatar';
import { UserProfile, UserProfileDocument } from '@app/shared-library/schemas/schema.user.profile';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {

  private readonly logger = new Logger(AppService.name);

  private web3Service: Web3Service;

  constructor(
    @InjectModel(UserAvatar.name) private userAvatarModel: Model<UserAvatarDocument>,
    @InjectModel(UserProfile.name) private userProfileModel: Model<UserProfileDocument>,
    @Inject(Web3ServiceGrpcClientName) private readonly web3ServiceGrpcClient: ClientGrpc
  ) { }

  async onModuleInit() {
    this.web3Service = this.web3ServiceGrpcClient.getService<Web3Service>(Web3ServiceName);
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
          response.userId = userModel._id;
        }
      } else if (request.email && request.password) {
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
            password: request.password
          });

          await userModel.save();
          response.success = true;
          response.userId = userModel._id;
        }
      } else {
        this.logger.error(`signUp failed. Bad params: ${request.ethAddress} | (${request.email} / ${request.password})`);
        response.reasonCode = SharedLibraryService.BAD_PARAMS;
      }
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

  // async signInOrUp(request: SignInOrUpRequest) {
  // const ethAddress = request.user.toLocaleLowerCase();
  // let user = await this.userModel.findOne({
  //   ethAddress
  // });

  // if (!user) {
  //   const userModel = new this.userModel({
  //     ethAddress,
  //     worldX: SharedLibraryService.BASE_POS_X,
  //     worldY: SharedLibraryService.BASE_POS_Y
  //   });
  //   user = await userModel.save();
  // }

  // const userAssets = await this.getUserAssets(ethAddress);
  // const captains = userAssets.captains.map(f => {
  //   return {
  //     id: f.id,
  //     owner: f.owner,
  //     level: f.level,
  //     traits: f.traits,
  //     miningRewardNVY: f.miningRewardNVY,
  //     stakingRewardNVY: f.stakingRewardNVY,
  //     miningStartedAt: f.miningStartedAt,
  //     miningDurationSeconds: f.miningDurationSeconds,
  //     rarity: f.rarity,
  //     bg: f.bg,
  //     acc: f.acc,
  //     head: f.head,
  //     haircutOrHat: f.haircutOrHat,
  //     clothes: f.clothes,
  //   } as CaptainEntity;
  // });
  // const ships = userAssets.ships.map(f => {
  //   return {
  //     id: f.id,
  //     owner: f.owner,
  //     armor: f.armor,
  //     hull: f.hull,
  //     maxSpeed: f.maxSpeed,
  //     accelerationStep: f.accelerationStep,
  //     accelerationDelay: f.accelerationDelay,
  //     rotationDelay: f.rotationDelay,
  //     fireDelay: f.fireDelay,
  //     cannons: f.cannons,
  //     cannonsRange: f.cannonsRange,
  //     cannonsDamage: f.cannonsDamage,
  //     level: f.level,
  //     traits: f.traits,
  //     size: f.size,
  //     rarity: f.rarity,
  //     windows: f.windows,
  //     anchor: f.anchor,
  //     currentIntegrity: f.currentIntegrity,
  //     maxIntegrity: f.maxIntegrity
  //   } as ShipEntity;
  // });
  // const islands = userAssets.islands.map(f => {
  //   return {
  //     id: f.id,
  //     owner: f.owner,
  //     level: f.level,
  //     rarity: f.rarity,
  //     terrain: f.terrain,
  //     size: f.size,
  //     miningRewardNVY: f.miningRewardNVY,
  //     shipAndCaptainFee: f.shipAndCaptainFee,
  //     minersFee: f.minersFee,
  //     maxMiners: f.maxMiners,
  //     miners: f.miners,
  //     mining: f.mining
  //   } as IslandEntity;
  // });

  // return {
  //   ethAddress: user.ethAddress,
  //   nickname: user.nickname,
  //   worldX: user.worldX,
  //   worldY: user.worldY,
  //   nvy: userAssets.nvy,
  //   aks: userAssets.aks,
  //   captains,
  //   ships,
  //   islands,
  //   dailyPlayersKilledCurrent: 0,
  //   dailyPlayersKilledMax: 0,
  //   dailyBotsKilledCurrent: 0,
  //   dailyBotsKilledMax: 0,
  //   dailyBossesKilledCurrent: 0,
  //   dailyBossesKilledMax: 0,
  // } as SignInOrUpResponse;
  // }

  async getUserPos(request: GetUserPosRequest) {
    const user = await this.userAvatarModel.findOne({
      ethAddress: request.user.toLocaleLowerCase()
    });
    if (user) {
      return {
        x: user.worldX,
        y: user.worldY
      } as GetUserPosResponse;
    };
  }

  private async getUserAssets(address: string) {
    return lastValueFrom(this.web3Service.GetAndSyncUserAssets({
      address
    }));
  }

}
