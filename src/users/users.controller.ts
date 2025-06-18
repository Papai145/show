import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-users.dto';
import { UsersService, UserSummary } from './users.service';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { UserIdMatchGuard } from './guards/userId-match-guard';
import { Users } from './models/users.models';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post('create')
  async createUser(@Body() createUser: CreateUserDto) {
    const foundUser = await this.userService.findByEmail(createUser.email);
    if (foundUser) {
      throw new ConflictException(
        'Пользователь с таким email уже зарегистрирован',
      );
    }
    const result = await this.userService.createUser(createUser);
    return {
      id: result._id,
      email: result.email,
      role: result.role,
    };
  }
  @UseGuards(JwtAdminAuthGuard)
  @Get('readAll')
  async readAllUsers(): Promise<UserSummary[]> {
    const result = await this.userService.findAll();
    return result;
  }
  @UseGuards(JwtUserAuthGuard, UserIdMatchGuard)
  @Get('read/:id')
  readById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId): Promise<Users> {
    return this.userService.findById(id);
  }
  @Get('delete')
  async delete() {
    return await this.userService.deleteAll();
  }
}
