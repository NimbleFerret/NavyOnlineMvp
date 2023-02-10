import { ConfirmationCode, ConfirmationCodeSchema } from '@app/shared-library/schemas/schema.confirmation.code';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfirmationService } from './confirmation.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ConfirmationCode.name, schema: ConfirmationCodeSchema }
        ])
    ],
    providers: [ConfirmationService],
    exports: [ConfirmationService]
})
export class ConfirmationModule { }