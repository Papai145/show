import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { Role } from '../../common/enums/users-role';
import { JwtUser } from '../../common/types/open-jwt-user';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined!');
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }
  validate({
    userId,
    email,
    role,
  }: Omit<JwtUser, 'role'> & { role: Role }): JwtUser {
    if (
      typeof email == 'string' &&
      typeof userId == 'string' &&
      role == Role.user
    ) {
      return { userId: userId, email: email, role: role };
    }
    throw new UnauthorizedException(
      'Что то пошло не так,попробуйте авторизоваться снова',
    );
  }
}
