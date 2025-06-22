import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-users.dto';
import { UsersService } from './users.service';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { JwtUserAuthGuard } from '../auth/guards/jwt-user-auth.guard';
import { Users } from './models/users.models';
import { UserSummary } from '../common/types/user-summary';
import { UserId } from 'src/common/decorators/user.decorator';

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
  @UseGuards(JwtUserAuthGuard)
  @Get('me')
  readById(@UserId() userId: string): Promise<Users> {
    return this.userService.findById(userId);
  }
  @Get('delete')
  async delete() {
    return await this.userService.deleteAll();
  }
}
