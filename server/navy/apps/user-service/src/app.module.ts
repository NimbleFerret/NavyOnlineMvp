import { Web3ServiceGrpcClientName, Web3ServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.web3.service';
import { Captain, CaptainSchema } from '@app/shared-library/schemas/schema.captain';
import { Island, IslandSchema } from '@app/shared-library/schemas/schema.island';
import { Ship, ShipSchema } from '@app/shared-library/schemas/schema.ship';
import { UserAvatar, UserAvatarSchema } from '@app/shared-library/schemas/schema.user.avatar';
import { UserProfile, UserProfileSchema } from '@app/shared-library/schemas/schema.user.profile';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserAvatar.name, schema: UserAvatarSchema },
      { name: UserProfile.name, schema: UserProfileSchema },
      { name: Captain.name, schema: CaptainSchema },
      { name: Ship.name, schema: ShipSchema },
      { name: Island.name, schema: IslandSchema },
    ]),
    MongooseModule.forRoot('mongodb://localhost/navy'),
    ClientsModule.register([
      {
        name: Web3ServiceGrpcClientName,
        ...Web3ServiceGrpcClientOptions,
      },
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
