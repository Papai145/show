import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { DataAuthDto } from './dto/validate-data.dto';
import { compareSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async login(data: DataAuthDto) {
    const { email, password } = data;
    const foundUser = await this.userService.findByEmail(email);
    if (!foundUser) {
      throw new BadRequestException('Неверно указан email');
    }
    if (!this.validatePassword(password, foundUser.password)) {
      throw new BadRequestException('Неверный пароль');
    }
    const { _id, role } = foundUser;
    const userId = _id.toHexString();
    const token = await this.jwtService.signAsync({ userId, email, role });
    return { token_access: token };
  }

  validatePassword(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}
