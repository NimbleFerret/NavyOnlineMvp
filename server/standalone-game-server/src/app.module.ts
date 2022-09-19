/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { WsModule } from './ws/ws.module';
import { MoralisModule } from './moralis/moralis.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { WorldModule } from './world/world.module';
import { GameplayModule } from './gameplay/gameplay.module';
import { CronosModule } from './cronos/cronos.module';
import { RewardModule } from './reward/reward.module';

@Module({
    imports: [
        CronosModule,
        MoralisModule,
        WsModule,
        UserModule,
        GameplayModule,
        WorldModule,
        RewardModule,
        EventEmitterModule.forRoot(),
        ScheduleModule.forRoot(),
        MongooseModule.forRoot('mongodb://localhost/navy')
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {

}
