import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RoomType } from '../../common/enums/room-type';

export type RoomsDocument = HydratedDocument<Rooms>;

@Schema()
export class Rooms {
  @Prop({ required: true })
  room: number;
  @Prop({ required: true, enum: RoomType })
  roomType: RoomType;
  // @Prop({})
  // picture: string;
}

export const RoomsSchema = SchemaFactory.createForClass(Rooms);
