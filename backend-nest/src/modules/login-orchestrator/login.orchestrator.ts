import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { toUserResponse } from '../user/user.mapper';
import { UnauthorizedException } from '../../common/errors/app.exception';
import type { LoginInput, LoginOutput } from './login.module';

@Injectable()
export class LoginOrchestrator {
  constructor(
    private readonly users: UserService,
    private readonly auth: AuthService,
  ) {}

  async execute({ email, password }: LoginInput): Promise<LoginOutput> {
    const found = await this.users.findByEmail(email);
    if (
      !found ||
      !(await this.auth.verifyPassword({
        password,
        passwordHash: found.passwordHash,
      }))
    ) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    const user = toUserResponse(found);
    return {
      user,
      token: this.auth.signToken({ id: user.id, email: user.email }),
    };
  }
}
