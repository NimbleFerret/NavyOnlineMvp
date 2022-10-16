import { SharedLibraryService } from '@app/shared-library';
import { SignInOrUpRequest } from '@app/shared-library/gprc/grpc.user.service';
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
