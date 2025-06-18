import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtUserStrategy } from './strategies/jwt-user.strategy';
import { JwtAdminStrategy } from './strategies/jwt-admin.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtUserStrategy, JwtAdminStrategy],
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],

  exports: [AuthService],
})
export class AuthModule {}
