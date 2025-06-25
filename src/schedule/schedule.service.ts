import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Schedule, ScheduleDocument } from './models/schedule.models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rooms, RoomsDocument } from '../rooms/models/rooms.models';
import { TelegramService } from 'src/telegram/telegram.service';
import { UsersService } from 'src/users/users.service';
import { PopulatedSchedule } from './types/answer.createSchedule';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private ScheduleModel: Model<ScheduleDocument>,
    @InjectModel(Rooms.name) private RoomsModel: Model<RoomsDocument>,
    private readonly telegramService: TelegramService,
    private readonly userService: UsersService,
  ) {}

  async getStatisticsByMonth(month: number): Promise<any[]> {
    const standardMonth = month + 1;
    return this.ScheduleModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: [
              { $month: { $dateFromString: { dateString: '$startDay' } } },
              standardMonth,
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          roomId: 1,
        },
      },
      {
        $lookup: {
          from: 'rooms',
          let: { roomIdString: '$roomId' }, // Ваш строковый ID
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$_id' }, '$$roomIdString'],
                },
              },
            },
            {
              $project: {
                _id: 0,
                room: 1,
              },
            },
          ],
          as: 'roomData',
        },
      },
      {
        $addFields: {
          NumberRoom: { $arrayElemAt: ['$roomData.room', 0] },
          number: 1,
        },
      },
      {
        $project: {
          roomId: 0,
          roomData: 0,
        },
      },
      {
        $group: {
          _id: '$NumberRoom',
          count: { $sum: '$number' },
        },
      },
    ]);
  }

  async createSchedule(
    roomId: string,
    userId: string,
    bookingDate: string,
  ): Promise<PopulatedSchedule> {
    if (!(await this.RoomsModel.exists({ _id: roomId }).exec())) {
      throw new BadRequestException('The identifier does not exist');
    }

    if (await this.IsRoomBooked(roomId, bookingDate)) {
      throw new ConflictException('Room is already booked for this date');
    }

    const newSchedule = new this.ScheduleModel({
      roomId: roomId,
      userId: userId,
      startDay: bookingDate,
    });

    try {
      const savedSchedule = await newSchedule.save();
      const populatedSchedule = await savedSchedule.populate<{
        userId: { name: string; phone: string };
        roomId: { room: number };
      }>([
        { path: 'userId', select: 'name phone -_id' },
        { path: 'roomId', select: 'room -_id' },
      ]);

      await this.telegramService.sendMessage(
        `Комната ${populatedSchedule.roomId.room} забронирована на ${populatedSchedule.startDay} клиентом ${populatedSchedule.userId.name}. Телефон: ${populatedSchedule.userId.phone}`,
      );

      return populatedSchedule;
    } catch {
      throw new InternalServerErrorException('Failed to create schedule');
    }
  }
  async UpdateBookingDate(
    scheduleId: string,
    roomId: string,
    date: string,
    userId: string,
  ): Promise<ScheduleDocument> {
    if (await this.IsRoomBooked(roomId, date)) {
      throw new ConflictException('Room is already booked for this date');
    }
    const updatedSchedule = await this.ScheduleModel.findOneAndUpdate(
      { roomId: roomId, userId: userId },
      {
        $set: { startDay: date },
      },
      { new: true, runValidators: true },
    ).exec();
    if (!updatedSchedule) {
      throw new NotFoundException(
        `Schedule with number room ${roomId} and userId not found`,
      );
    }
    return updatedSchedule;
  }
  async IsRoomBooked(roomId: string, date: string): Promise<boolean> {
    const booking = await this.ScheduleModel.findOne({
      roomId: roomId,
      startDay: date,
    }).exec();
    return !!booking;
  }
  async deletingBooking(
    bookingId: string,
    userId: string,
  ): Promise<PopulatedSchedule> {
    const deletedSchedule = await this.ScheduleModel.findOneAndDelete({
      _id: bookingId,
      userId: userId,
    })
      .exec()
      .then((doc) => {
        if (!doc) {
          return null;
        }
        return doc.populate<{
          userId: { name: string; phone: string };
          roomId: { room: number };
        }>([
          { path: 'userId', select: 'name phone -_id' },
          { path: 'roomId', select: 'room -_id' },
        ]);
      });

    if (!deletedSchedule) {
      throw new NotFoundException(`Schedule with ID ${bookingId} not found`);
    }

    await this.telegramService.sendMessage(
      `Запись комнаты  ${deletedSchedule.roomId.room} удалена на число ${deletedSchedule.startDay}  клиентом ${deletedSchedule.userId.name}. Телефон: ${deletedSchedule.userId.phone}`,
    );

    return deletedSchedule;
  }
  async getOccupiedDatesByRoomId(): Promise<ScheduleDocument[]> {
    const res = await this.ScheduleModel.find();
    console.log(typeof res[0].roomId);
    return res;
  }
}
