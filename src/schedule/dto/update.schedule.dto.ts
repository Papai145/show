import { Type } from 'class-transformer';
import { IsValidDateFormat } from '../../common/decorators/is-valid-date-format.decorator';
import { IsMongoId } from 'class-validator';

export class UpdateSchedule {
  @IsMongoId()
  @Type(() => String)
  roomId: string;
  @IsValidDateFormat()
  @Type(() => String)
  date: string;
}
