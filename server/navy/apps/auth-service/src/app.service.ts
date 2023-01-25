import { UserAuth, UserAuthDocument } from '@app/shared-library/schemas/schema.auth';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppService {

  constructor(@InjectModel(UserAuth.name) private userAuthModel: Model<UserAuthDocument>) {

  }

  async findUserByEmail(email: string): Promise<UserAuth | undefined> {
    const user = await this.userAuthModel.findOne({
      email
    });
    return user;
  }

}
