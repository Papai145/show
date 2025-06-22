import { Type } from 'class-transformer';
import { IsMongoId } from 'class-validator';

export class IdParamDto {
  @IsMongoId()
  @Type(() => String)
  id: string;
}
