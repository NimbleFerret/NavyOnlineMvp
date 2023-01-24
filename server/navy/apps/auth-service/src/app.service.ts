import { UserAuth, UserAuthDocument } from '@app/shared-library/schemas/schema.auth';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppService {

  constructor(@InjectModel(UserAuth.name) private userAuthModel: Model<UserAuthDocument>) {

  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findUserByEmail(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private async findUserByEmail(email: string): Promise<UserAuth | undefined> {
    const user = await this.userAuthModel.findOne({
      email
    });
    return user;
  }

}
