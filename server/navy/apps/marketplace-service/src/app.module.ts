import { Web3ServiceGrpcClientName, Web3ServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.web3.service';
import { NotificationServiceGrpcClientName, NotificationServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.notification.service';
import { Project, ProjectSchema } from '@app/shared-library/schemas/marketplace/schema.project';
import { Collection, CollectionSchema } from '@app/shared-library/schemas/marketplace/schema.collection';
import { Mint, MintSchema } from '@app/shared-library/schemas/marketplace/schema.mint';
import { CollectionItem, CollectionItemSchema } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { Notification, NotificationSchema } from '@app/shared-library/schemas/marketplace/schema.notification';
import { Bid, BidSchema } from '@app/shared-library/schemas/marketplace/schema.bid';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MintModule } from './mint/mint.module';
import { Config } from '@app/shared-library/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppControllerAuth } from './app.controller.auth';
import { Faq, FaqSchema } from '@app/shared-library/schemas/marketplace/schema.faq';
import { Feedback, FeedbackSchema } from '@app/shared-library/schemas/marketplace/schema.feedback';
import { BidApiService } from './api/api.bid';
import { NotificationApiService } from './api/api.notification';
import { CollectionApiService } from './api/api.collection';
import { DashboardApiService } from './api/api.dashboard';
import { GeneralApiService } from './api/api.general';
import { FavouriteApiService } from './api/api.favourite';

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
      { name: CollectionItem.name, schema: CollectionItemSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: Bid.name, schema: BidSchema },
      { name: Faq.name, schema: FaqSchema },
      { name: Feedback.name, schema: FeedbackSchema }
    ]),
    MongooseModule.forRoot(Config.GetMongoHost(), {
      dbName: 'navy'
    }),
    ClientsModule.register([
      {
        name: Web3ServiceGrpcClientName,
        ...Web3ServiceGrpcClientOptions,
      },
      {
        name: NotificationServiceGrpcClientName,
        ...NotificationServiceGrpcClientOptions,
      },
    ]),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController, AppControllerAuth],
  providers: [
    AppService,
    BidApiService,
    CollectionApiService,
    DashboardApiService,
    GeneralApiService,
    NotificationApiService,
    FavouriteApiService
  ],
})
export class AppModule { }
