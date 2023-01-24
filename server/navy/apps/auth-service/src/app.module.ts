import { UserAuth, UserAuthSchema } from '@app/shared-library/schemas/schema.auth';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserAuth.name, schema: UserAuthSchema },
    ]),
    MongooseModule.forRoot('mongodb://localhost/navy'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
