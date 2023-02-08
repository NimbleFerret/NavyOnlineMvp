import { Web3ServiceGrpcClientName, Web3ServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.web3.service';
import { MintDetails, MintDetailsSchema } from '@app/shared-library/schemas/marketplace/schema.mint.details';
import { ProjectDetails, ProjectDetailsSchema } from '@app/shared-library/schemas/marketplace/schema.project';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MintModule } from './mint/mint.module';

@Module({
  imports: [
    MintModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'marketplace-service'),
    }),
    MongooseModule.forFeature([
      { name: ProjectDetails.name, schema: ProjectDetailsSchema },
      { name: MintDetails.name, schema: MintDetailsSchema },
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
