import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from '../auth/dto/signup.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { SignupOrchestrator } from '../signup/signup.orchestrator';
import type { SignupOutput } from '../signup/signup.module';
import { LoginOrchestrator } from '../login/login.orchestrator';
import type { LoginOutput } from '../login/login.module';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupOrchestrator: SignupOrchestrator,
    private readonly loginOrchestrator: LoginOrchestrator,
  ) {}

  @Post('signup')
  signup(@Body() dto: SignupDto): Promise<SignupOutput> {
    return this.signupOrchestrator.run(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto): Promise<LoginOutput> {
    return this.loginOrchestrator.run(dto);
  }
}
