import { UserAuth, UserAuthSchema } from '@app/shared-library/schemas/schema.user.profile';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: UserAuth.name, schema: UserAuthSchema },
        ]),
        MongooseModule.forRoot('mongodb://localhost/navy'),
    ],
    providers: [
        UsersService,
    ],
    exports: [
        UsersService
    ]
})
export class UsersModule { }
