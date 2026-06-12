import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResult } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto): Promise<AuthResult> {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto): Promise<AuthResult> {
    return this.authService.login(dto);
  }
}
