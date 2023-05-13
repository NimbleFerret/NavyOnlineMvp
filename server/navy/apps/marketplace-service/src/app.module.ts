import { Web3ServiceGrpcClientName, Web3ServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.web3.service';
import { NotificationServiceGrpcClientName, NotificationServiceGrpcClientOptions } from '@app/shared-library/gprc/grpc.notification.service';
import { Project, ProjectSchema } from '@app/shared-library/schemas/marketplace/schema.project';
import { Collection, CollectionSchema } from '@app/shared-library/schemas/marketplace/schema.collection';
import { Mint, MintSchema } from '@app/shared-library/schemas/marketplace/schema.mint';
import { CollectionItem, CollectionItemSchema } from '@app/shared-library/schemas/marketplace/schema.collection.item';
import { Notification, NotificationSchema } from '@app/shared-library/schemas/marketplace/schema.notification';
import { Bid, BidSchema } from '@app/shared-library/schemas/marketplace/schema.bid';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthApiService } from './api/api.auth';
import { UserProfile, UserProfileSchema } from '@app/shared-library/schemas/schema.user.profile';
import { Favourite, FavouriteSchema } from '@app/shared-library/schemas/marketplace/schema.favourite';

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
      { name: Feedback.name, schema: FeedbackSchema },
      { name: Favourite.name, schema: FavouriteSchema },
      { name: UserProfile.name, schema: UserProfileSchema }
    ]),
    MongooseModule.forRoot(Config.GetMongoHost(), {
      dbName: Config.MongoDBName
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
    AuthApiService,
    BidApiService,
    CollectionApiService,
    DashboardApiService,
    GeneralApiService,
    NotificationApiService,
    FavouriteApiService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'marketplace/auth/notifications', method: RequestMethod.GET },
        { path: 'marketplace/auth/notifications', method: RequestMethod.POST },
        { path: 'marketplace/auth/favourites', method: RequestMethod.GET },
        { path: 'marketplace/auth/favourites', method: RequestMethod.POST },
        { path: 'marketplace/auth/update', method: RequestMethod.POST },
        { path: 'marketplace/auth/logout', method: RequestMethod.POST },
        { path: 'marketplace/auth/myNft', method: RequestMethod.GET },
        { path: 'marketplace/auth/attachEmail', method: RequestMethod.GET },
        { path: 'marketplace/auth/attachWallet', method: RequestMethod.GET },
        { path: 'marketplace/auth/updatePassword', method: RequestMethod.GET },
      );
  }
}
