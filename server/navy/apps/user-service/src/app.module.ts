import { Web3ServiceGrpcClientName, Web3ServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.web3.service';
import { Captain, CaptainSchema } from '@app/shared-library/schemas/schema.captain';
import { Island, IslandSchema } from '@app/shared-library/schemas/schema.island';
import { Ship, ShipSchema } from '@app/shared-library/schemas/schema.ship';
import { User, UserSchema } from '@app/shared-library/schemas/schema.user';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
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
