import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { NFTService } from './nft.service';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'blockchain',
        }),
    ],
    providers: [NFTService],
    exports: [NFTService]
})
export class NFTModule { }
