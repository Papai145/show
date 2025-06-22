import { Type } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import { RoomType } from '../../common/enums/room-type';

export class CreateRoomDto {
  @Type(() => Number)
  @IsNumber()
  room: number;
  @IsEnum(RoomType)
  roomType: RoomType;
}
