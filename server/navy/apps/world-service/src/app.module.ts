import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Island, IslandSchema } from '../../../libs/shared-library/src/schemas/schema.island';
import { Sector, SectorSchema } from '@app/shared-library/schemas/schema.sector';
import { World, WorldSchema } from '@app/shared-library/schemas/schema.world';
import { User, UserSchema } from '@app/shared-library/schemas/schema.user';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sector.name, schema: SectorSchema },
      { name: World.name, schema: WorldSchema },
      { name: Island.name, schema: IslandSchema },
      { name: User.name, schema: UserSchema }
    ]),
    MongooseModule.forRoot('mongodb://localhost/navy')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }