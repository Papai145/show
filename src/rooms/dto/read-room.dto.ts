import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ReadRoomDto {
  @Type(() => Number)
  @IsNumber()
  page: number = 1;

  @Type(() => Number)
  @IsNumber()
  limit: number = 10;
}
