import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DataAuthDto } from './dto/validate-data.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() data: DataAuthDto) {
    const result = await this.authService.login(data);
    return result;
  }
}
