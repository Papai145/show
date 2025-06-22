import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema()
export class Schedule {
  @Prop({ type: Types.ObjectId, ref: 'Rooms', required: true })
  roomId: string;
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  userId: string;
  @Prop({
    type: String,
  })
  startDay: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
