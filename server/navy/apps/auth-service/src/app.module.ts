import { UserAuth, UserAuthSchema } from '@app/shared-library/schemas/schema.auth';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Constants } from './app.constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserAuth.name, schema: UserAuthSchema },
    ]),
    MongooseModule.forRoot('mongodb://localhost/navy'),
    PassportModule,
    JwtModule.register({
      secret: Constants.jwtSecret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LocalStrategy,
    JwtStrategy
  ],
})
export class AppModule { }
