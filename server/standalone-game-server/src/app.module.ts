/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { WsModule } from './ws/ws.module';
import { MoralisModule } from './moralis/moralis.module';
import { GameModule } from './game/game.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { WorldModule } from './world/world.module';
import { AppController } from './app.controller';

@Module({
    imports: [
        MoralisModule,
        WsModule,
        GameModule,
        UserModule,
        WorldModule,
        EventEmitterModule.forRoot(),
        ScheduleModule.forRoot(),
        MongooseModule.forRoot('mongodb://localhost/nest')
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {

}
