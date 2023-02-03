import { UserAuth, UserAuthSchema } from '@app/shared-library/schemas/schema.auth';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost/navy'),
    MongooseModule.forFeature([
      { name: UserAuth.name, schema: UserAuthSchema },
    ]),
    // PassportModule,
    // JwtModule.register({
    //   secret: Constants.jwtSecret,
    //   signOptions: { expiresIn: '60s' },
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // LocalStrategy,
    // JwtStrategy
  ],
})
export class AppModule { }
