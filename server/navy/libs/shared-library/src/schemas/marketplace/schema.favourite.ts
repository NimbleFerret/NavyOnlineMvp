/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserProfile } from '../schema.user.profile';

export type FavouriteDocument = Favourite & Document;

@Schema()
export class Favourite {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' })
    userProfile: UserProfile;

    @Prop()
    tokenId: string;

    @Prop()
    contractAddress: number;

}

export const FavouriteSchema = SchemaFactory.createForClass(Favourite);