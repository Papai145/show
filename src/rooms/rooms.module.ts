import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Rooms, RoomsSchema } from './models/rooms.models';
import { Schedule, ScheduleSchema } from '../schedule/models/schedule.models';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService],
  imports: [
    MongooseModule.forFeature([{ name: Rooms.name, schema: RoomsSchema }]),
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
    PassportModule,
  ],
  exports: [MongooseModule],
})
export class RoomsModule {}
