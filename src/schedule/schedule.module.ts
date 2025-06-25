import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Schedule, ScheduleSchema } from './models/schedule.models';
import { RoomsModule } from '../rooms/rooms.module';
import { TelegramModule } from 'src/telegram/telegram.module';
import { UsersModule } from 'src/users/users.module';
// import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
    RoomsModule,
    TelegramModule,
    UsersModule,
  ],
})
export class ScheduleModule {}
