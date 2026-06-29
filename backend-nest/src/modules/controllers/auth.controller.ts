import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from '../auth/dto/signup.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { SignupOrchestrator } from '../signup-orchestrator/signup.orchestrator';
import type { SignupOutput } from '../signup-orchestrator/signup.module';
import { LoginOrchestrator } from '../login-orchestrator/login.orchestrator';
import type { LoginOutput } from '../login-orchestrator/login.module';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupOrchestrator: SignupOrchestrator,
    private readonly loginOrchestrator: LoginOrchestrator,
  ) {}

  @Post('signup')
  signup(@Body() dto: SignupDto): Promise<SignupOutput> {
    return this.signupOrchestrator.execute(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto): Promise<LoginOutput> {
    return this.loginOrchestrator.execute(dto);
  }
}
