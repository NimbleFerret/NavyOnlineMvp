import { Web3ServiceGrpcClientName, Web3ServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.web3.service';
import { Project, ProjectSchema } from '@app/shared-library/schemas/marketplace/schema.project';
import { Collection, CollectionSchema } from '@app/shared-library/schemas/marketplace/schema.collection';
import { Mint, MintSchema } from '@app/shared-library/schemas/marketplace/schema.mint';
import { CollectionItem, CollectionItemSchema } from '@app/shared-library/schemas/marketplace/schema.collection.item';
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
      { name: Project.name, schema: ProjectSchema },
      { name: Mint.name, schema: MintSchema },
      { name: Collection.name, schema: CollectionSchema },
      { name: CollectionItem.name, schema: CollectionItemSchema }
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
