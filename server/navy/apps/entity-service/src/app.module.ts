import { Config } from '@app/shared-library/config';
import { CaptainSettings, CaptainSettingsSchema } from '@app/shared-library/schemas/entity/schema.captain.settings';
import { CaptainTrait, CaptainTraitSchema } from '@app/shared-library/schemas/entity/schema.captain.trait';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CaptainTrait.name, schema: CaptainTraitSchema },
      { name: CaptainSettings.name, schema: CaptainSettingsSchema },
    ]),
    MongooseModule.forRoot(Config.GetMongoHost(), {
      dbName: Config.MongoDBName
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
