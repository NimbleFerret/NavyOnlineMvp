import { SectorContent } from '@app/shared-library/shared-library.main';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IslandSchema, Island } from './schema.island';

export type SectorDocument = Sector & Document;

@Schema()
export class Sector {

    @Prop({ required: true, index: true })
    positionId: number;

    @Prop()
    x: number;

    @Prop()
    y: number;

    @Prop({
        type: Number,
        required: true,
        enum: [
            SectorContent.EMPTY,
            SectorContent.BASE,
            SectorContent.ISLAND,
            SectorContent.BOSS,
            SectorContent.PVE,
            SectorContent.PVP,
        ],
        default: SectorContent.EMPTY
    })
    content: SectorContent;

    @Prop({ default: false })
    locked: boolean;

    @Prop({ type: IslandSchema })
    island: Island;
}

export const SectorSchema = SchemaFactory.createForClass(Sector);