import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class DataAuthDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
