import { Type } from 'class-transformer';
import { IsValidDateFormat } from '../../common/decorators/is-valid-date-format.decorator';

export class DateDto {
  @IsValidDateFormat()
  @Type(() => String)
  date: string;
}
