// import { Injectable } from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleDocument } from './models/schedule.models';

import { IdParamDto } from './dto/paramId.dto';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';

import { UserId } from '../common/decorators/user.decorator';
import { UpdateSchedule } from './dto/update.schedule.dto';
import { DateDto } from './dto/date.dto';
import { JwtAdminAuthGuard } from 'src/auth/guards/jwt-admin-auth.guard';
import { PopulatedSchedule } from './types/answer.createSchedule';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(JwtAdminAuthGuard)
  @Get('getStatisticsByMonth')
  async getStatisticsByMonth(@Query('month') month: string): Promise<any[]> {
    return await this.scheduleService.getStatisticsByMonth(Number(month));
  }

  @UseGuards(JwtUserAuthGuard)
  @Post('create/:id')
  @HttpCode(HttpStatus.CREATED)
  async createBooking(
    @Param() roomId: IdParamDto,
    @Body() dateObj: DateDto,
    @UserId() userId: string,
  ): Promise<PopulatedSchedule | void> {
    return this.scheduleService.createSchedule(roomId.id, userId, dateObj.date);
  }

  @UseGuards(JwtUserAuthGuard)
  @Patch('updateDate/:id')
  async updateCheckInDate(
    @Param() scheduleId: IdParamDto,
    @Body() dataUpdate: UpdateSchedule,
    @UserId() userId: string,
  ): Promise<ScheduleDocument | void> {
    return await this.scheduleService.UpdateBookingDate(
      scheduleId.id,
      dataUpdate.roomId,
      dataUpdate.date,
      userId,
    );
  }

  @UseGuards(JwtUserAuthGuard)
  @Delete('deleteBooking/:id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBooking(
    @Param() scheduleId: IdParamDto,
    @UserId() userId: string,
  ): Promise<PopulatedSchedule> {
    const result = await this.scheduleService.deletingBooking(
      scheduleId.id,
      userId,
    );
    return result;
  }

  @UseGuards(JwtAdminAuthGuard)
  @Get('allBooking')
  getAllBooking(): Promise<ScheduleDocument[]> {
    return this.scheduleService.getOccupiedDatesByRoomId();
  }
}
