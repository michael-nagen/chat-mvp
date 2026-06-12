import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from './user.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthUser): UserResponse {
    return this.userService.returnUser(user.userId);
  }
}
