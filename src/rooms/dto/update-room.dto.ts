import { IsEnum, IsString } from 'class-validator';
import { RoomType } from '../../common/enums/room-type';

export class UpdateTypeRoomDto {
  @IsString()
  roomId: string;
  @IsEnum(RoomType)
  roomType: RoomType;
}
