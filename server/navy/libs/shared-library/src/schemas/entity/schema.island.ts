import { IslandSize, Rarity, Terrain } from "@app/shared-library/shared-library.main";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserAvatarDocument } from "../schema.user.avatar";
import mongoose, { Document } from 'mongoose';

export type IslandDocument = Island & Document;

@Schema()
export class Island {

    @Prop()
    tokenId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserAvatar' })
    owner: UserAvatarDocument;

    @Prop()
    x: number;

    @Prop()
    y: number;

    @Prop({
        type: Number,
        required: true,
        enum: [
            Terrain.GREEN,
            Terrain.SNOW,
            Terrain.DARK,
        ]
    })
    terrain: Terrain;

    @Prop()
    level: number;

    @Prop({
        type: Number,
        required: true,
        enum: [
            Rarity.COMMON,
            Rarity.RARE,
            Rarity.EPIC,
            Rarity.LEGENDARY,
        ]
    })
    rarity: Rarity;

    @Prop({
        type: Number,
        required: true,
        enum: [
            IslandSize.SMALL,
            IslandSize.MIDDLE,
            IslandSize.LARGE,
            IslandSize.EXTRA_LARGE,
        ],
        default: IslandSize.SMALL
    })
    size: IslandSize;

    // Mining 

    @Prop()
    mining: boolean;

    @Prop()
    miningStartedAt: number;

    @Prop()
    miningDurationSeconds: number;

    @Prop()
    miningRewardNVY: number;

    @Prop()
    shipAndCaptainFee: number;

    @Prop()
    minersFee: number;

    @Prop()
    miners: number;

    @Prop()
    maxMiners: number;
}

export const IslandSchema = SchemaFactory.createForClass(Island);