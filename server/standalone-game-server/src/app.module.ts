/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { WsModule } from './ws/ws.module';
import { MoralisModule } from './moralis/moralis.module';
import { GameModule } from './game/game.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
    imports: [
        MoralisModule,
        WsModule,
        GameModule,
        EventEmitterModule.forRoot()
    ],
    providers: [AppService],
})
export class AppModule {

}
