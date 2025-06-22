import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Schedule, ScheduleSchema } from './models/schedule.models';
import { RoomsModule } from '../rooms/rooms.module';
// import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
    RoomsModule,
    // PassportModule,
  ],
})
export class ScheduleModule {}
