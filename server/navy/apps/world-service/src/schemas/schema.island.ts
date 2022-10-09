import { IslandSize } from "@app/shared-library/shared-library.main";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type IslandDocument = Island & Document;

@Schema()
export class Island {

    @Prop()
    tokenId: string;

    @Prop()
    owner: string;

    @Prop({ default: false })
    isBase: boolean;

    @Prop()
    x: number;

    @Prop()
    y: number;

    @Prop()
    terrain: string;

    @Prop()
    level: number;

    @Prop()
    rarity: number;

    @Prop({
        type: Number,
        required: true,
        enum: [
            IslandSize.SMALL,
            IslandSize.MIDDLE,
            IslandSize.LARGE,
            IslandSize.EXTRA_LARGE,
        ]
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