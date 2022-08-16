import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto, SignUpDto } from './dto';
import * as argon from 'argon2';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignUpDto) {
    return this.authService.signup(
      dto.email,
      dto.password,
      dto.firstname,
      dto.lastname,
    );
  }

  @Post('login')
  async login(@Body() dto: LogInDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
