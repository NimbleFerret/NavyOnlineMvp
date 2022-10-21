import { SectorContent } from '@app/shared-library/gprc/grpc.world.service';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IslandDocument } from './schema.island';

export type SectorDocument = Sector & Document;

@Schema()
export class Sector {

    @Prop({ required: true, index: true })
    positionId: string;

    @Prop()
    x: number;

    @Prop()
    y: number;

    @Prop({
        type: Number,
        required: true,
        enum: [
            SectorContent.SECTOR_CONTENT_EMPTY,
            SectorContent.SECTOR_CONTENT_BASE,
            SectorContent.SECTOR_CONTENT_ISLAND,
            SectorContent.SECTOR_CONTENT_BOSS,
            SectorContent.SECTOR_CONTENT_PVE,
            SectorContent.SECTOR_CONTENT_PVP,
        ],
        default: SectorContent.SECTOR_CONTENT_EMPTY
    })
    content: SectorContent;

    @Prop({ default: false })
    locked: boolean;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Island' })
    island: IslandDocument;
}

export const SectorSchema = SchemaFactory.createForClass(Sector);