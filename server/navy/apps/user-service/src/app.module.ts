import { Config } from '@app/shared-library/config';
import { Web3ServiceGrpcClientName, Web3ServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.web3.service';
import { Captain, CaptainSchema } from '@app/shared-library/schemas/entity/schema.captain';
import { Island, IslandSchema } from '@app/shared-library/schemas/entity/schema.island';
import { Ship, ShipSchema } from '@app/shared-library/schemas/entity/schema.ship';
import { UserAvatar, UserAvatarSchema } from '@app/shared-library/schemas/schema.user.avatar';
import { UserProfile, UserProfileSchema } from '@app/shared-library/schemas/schema.user.profile';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: UserAvatar.name, schema: UserAvatarSchema },
      { name: UserProfile.name, schema: UserProfileSchema },
      { name: Captain.name, schema: CaptainSchema },
      { name: Ship.name, schema: ShipSchema },
      { name: Island.name, schema: IslandSchema },
    ]),
    MongooseModule.forRoot(Config.GetMongoHost(), {
      dbName: Config.MongoDBName
    }),
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
