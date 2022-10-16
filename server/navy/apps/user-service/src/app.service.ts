import { SharedLibraryService } from '@app/shared-library';
import { CaptainEntity } from '@app/shared-library/entities/entity.captain';
import { IslandEntity } from '@app/shared-library/entities/entity.island';
import { ShipEntity } from '@app/shared-library/entities/entity.ship';
import { SignInOrUpRequest, SignInOrUpResponse } from '@app/shared-library/gprc/grpc.user.service';
import {
  GetUserAssetsResponse,
  Web3Service,
  Web3ServiceGrpcClientName,
  Web3ServiceName
} from '@app/shared-library/gprc/grpc.web3.service';
import { User, UserDocument } from '@app/shared-library/schemas/schema.user';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppService implements OnModuleInit {

  private readonly logger = new Logger(AppService.name);

  private web3Service: Web3Service;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(Web3ServiceGrpcClientName) private readonly web3ServiceGrpcClient: ClientGrpc
  ) { }

  async onModuleInit() {
    this.web3Service = this.web3ServiceGrpcClient.getService<Web3Service>(Web3ServiceName);
  }


  async signInOrUp(request: SignInOrUpRequest) {
    console.log('signInOrUp !');

    const ethAddress = request.user.toLocaleLowerCase();

    let user = await this.userModel.findOne({
      ethAddress
    }).populate('shipsOwned').populate('captainsOwned').populate('islandsOwned');

    if (user) {
      console.log('User found');
      await this.syncPlayer(user);
    } else {
      const userModel = new this.userModel({
        ethAddress,
        worldX: SharedLibraryService.BASE_POS_X,
        worldY: SharedLibraryService.BASE_POS_Y
      });
      user = await userModel.save();
      await this.syncPlayer(user);

      console.log('User not found');
    }

    const ownedCaptains = user.captainsOwned.map(f => {
      return {
        id: f.tokenId,
        owner: f.owner,
        level: f.level,
        traits: f.traits,
        miningRewardNVY: f.miningRewardNVY,
        stakingRewardNVY: f.stakingRewardNVY,
        miningStartedAt: f.miningStartedAt,
        miningDurationSeconds: f.miningDurationSeconds,
        rarity: f.rarity,
        bg: f.bg,
        acc: f.acc,
        head: f.head,
        haircutOrHat: f.haircutOrHat,
        clothes: f.clothes,
      } as CaptainEntity;
    });

    const ownedShips = user.shipsOwned.map(f => {
      return {
        id: f.tokenId,
        owner: f.owner,
        armor: f.armor,
        hull: f.hull,
        maxSpeed: f.maxSpeed,
        accelerationStep: f.accelerationStep,
        accelerationDelay: f.accelerationDelay,
        rotationDelay: f.rotationDelay,
        fireDelay: f.fireDelay,
        cannons: f.cannons,
        cannonsRange: f.cannonsRange,
        cannonsDamage: f.cannonsDamage,
        level: f.level,
        traits: f.traits,
        size: f.size,
        rarity: f.rarity,
        windows: f.windows,
        anchor: f.anchor,
        currentIntegrity: f.currentIntegrity,
        maxIntegrity: f.maxIntegrity
      } as ShipEntity;
    });

    const ownedIslands = user.islandsOwned.map(f => {
      return {
        id: f.tokenId,
        owner: f.owner,
        level: f.level,
        rarity: f.rarity,
        terrain: f.terrain,
        size: f.size,
        miningRewardNVY: f.miningRewardNVY,
        shipAndCaptainFee: f.shipAndCaptainFee,
        minersFee: f.minersFee,
        maxMiners: f.maxMiners,
        miners: f.miners,
        mining: f.mining
      } as IslandEntity;
    });

    const signInOrUpResponse = {
      ethAddress: user.ethAddress,
      nickname: user.nickname,
      worldX: user.worldX,
      worldY: user.worldY,
      nvy: user.nvyBalance,
      aks: user.aksBalance,
      ownedCaptains,
      ownedShips,
      ownedIslands,
    } as SignInOrUpResponse;
  }

  private async syncPlayer(user: UserDocument) {
    return new Promise((resolve, reject) => {
      console.log('syncPlayer...');

      this.web3Service.GetUserAssets({
        address: user.ethAddress
      }).subscribe({
        next: async (response: GetUserAssetsResponse) => {
          user.nvyBalance = response.nvy;
          user.aksBalance = response.aks;
          await user.save();
          resolve(user);
        },
        error: (e) => {
          this.logger.error(`Cant get user assets`, e);
          reject(e);
        }
      });
    });
  }

}
