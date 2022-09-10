/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { WsModule } from './ws/ws.module';
import { MoralisModule } from './moralis/moralis.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { WorldModule } from './world/world.module';
import { GameplayModule } from './gameplay/gameplay.module';
import { AppController } from './app.controller';
import { ShipyardModule } from './shipyard/shipyard.module';
import { CronosModule } from './cronos/cronos.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
        MoralisModule,
        WsModule,
        UserModule,
        GameplayModule,
        WorldModule,
        ShipyardModule,
        CronosModule,
        EventEmitterModule.forRoot(),
        ScheduleModule.forRoot(),
        MongooseModule.forRoot('mongodb://localhost/navy')
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {

}
