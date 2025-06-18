import {
  Body,
  // ConflictException,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomsDocument } from './models/rooms.models';
import { UpdateTypeRoomDto } from './dto/update-room.dto';
import { ReadRoomDto } from './dto/read-room.dto';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';

@Controller('rooms')
export class RoomsController {
  private readonly logger = new Logger(RoomsController.name);
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(JwtAdminAuthGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() CreateRoomDto: CreateRoomDto,
  ): Promise<RoomsDocument | void> {
    this.logger.log('Пошло создание комнаты');
    const result = await this.roomsService.create(CreateRoomDto);
    return result;
  }

  @Get('read')
  @Header('Content-Type', 'application/json')
  async readRooms(@Query() query: ReadRoomDto): Promise<{
    data: RoomsDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    const result = await this.roomsService.getRooms(query.page, query.limit);
    return {
      ...result,
      page: query.page,
      limit: query.limit,
    };
  }

  @UseGuards(JwtAdminAuthGuard)
  @Patch('update')
  async update(@Body() data: UpdateTypeRoomDto): Promise<RoomsDocument> {
    const result = await this.roomsService.updateRoomType(
      data.roomId,
      data.roomType,
    );
    return result;
  }
  @UseGuards(JwtAdminAuthGuard)
  @Delete('delete/:id')
  async deleteRoom(@Param('id') id: string): Promise<RoomsDocument> {
    return await this.roomsService.deleteRoomById(id);
  }
}
