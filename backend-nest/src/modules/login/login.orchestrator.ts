import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { toUserResponse } from '../user/user.mapper';
import { UnauthorizedException } from '../../common/errors/app.exception';
import type { LoginInput, LoginOutput } from './login.module';

@Injectable()
export class LoginOrchestrator {
  constructor(
    private readonly users: UserService,
    private readonly jwt: JwtService,
  ) {}

  async run({ email, password }: LoginInput): Promise<LoginOutput> {
    const found = await this.users.findByEmail(email);
    if (!found || !(await bcrypt.compare(password, found.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    const user = toUserResponse(found);
    return { user, token: this.jwt.sign({ sub: user.id, email: user.email }) };
  }
}
