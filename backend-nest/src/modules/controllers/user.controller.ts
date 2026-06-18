import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { GetMeOrchestrator } from '../get-me/get-me.orchestrator';
import type { GetMeOutput } from '../get-me/get-me.module';

@Controller()
export class UserController {
  constructor(private readonly getMe: GetMeOrchestrator) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthUser): Promise<GetMeOutput> {
    return this.getMe.run({ userId: user.userId });
  }
}
