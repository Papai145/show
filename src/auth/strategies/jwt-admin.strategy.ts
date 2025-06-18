import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '../../common/enums/users-role';
import { Users } from '../../users/models/users.models';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
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
  validate({ role, email }: Pick<Users, 'role' | 'email'>) {
    if (role !== Role.admin) {
      throw new UnauthorizedException(
        `У вас нет прав на данную операцию.У вас должна быть admin а у вас роль ${role}`,
      );
    }
    return email;
  }
}
