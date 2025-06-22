import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Schedule, ScheduleDocument } from './models/schedule.models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rooms, RoomsDocument } from '../rooms/models/rooms.models';
import { RoomType } from 'src/common/enums/room-type';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private ScheduleModel: Model<ScheduleDocument>,
    @InjectModel(Rooms.name) private RoomsModel: Model<RoomsDocument>,
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
  ): Promise<ScheduleDocument> {
    if (!(await this.RoomsModel.exists({ _id: roomId }))) {
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
    return await newSchedule.save();
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
  ): Promise<{ roomId: string; startDay: string }> {
    const deletedSchedule = await this.ScheduleModel.findOneAndDelete(
      {
        _id: bookingId,
        userId: userId,
      },
      { projection: { roomId: 1, startDay: 1 } },
    ).exec();
    if (!deletedSchedule) {
      throw new NotFoundException(`Schedule with ID ${bookingId} not found`);
    }
    return deletedSchedule;
  }
  async getOccupiedDatesByRoomId(): Promise<ScheduleDocument[]> {
    const res = await this.ScheduleModel.find();
    console.log(typeof res[0].roomId);
    return res;
  }
}
