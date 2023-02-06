import { MintDetails, MintDetailsSchema } from '@app/shared-library/schemas/schema.mint.details';
import { Module } from '@nestjs/common';
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
      { name: MintDetails.name, schema: MintDetailsSchema },
    ]),
    MongooseModule.forRoot('mongodb://localhost/navy'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
