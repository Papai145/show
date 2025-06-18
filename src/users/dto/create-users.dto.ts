// import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IsValidRussiaNumberPhone } from '../../common/decorators/is-valid-russia-number';
import { Role } from '../../common/enums/users-role';

export class CreateUserDto {
  @IsString()
  @IsEmail({}, { message: 'Введите корректный email' })
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  @IsValidRussiaNumberPhone()
  phone: string;
  // @Transform(() => {
  //   return Role.user;
  // })
  // @IsOptional()
  @IsEnum(Role)
  role: Role;
}
