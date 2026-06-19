import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { toUserResponse } from '../user/user.mapper';
import { ConflictException } from '../../common/errors/app.exception';
import { SALT_ROUNDS } from '../auth/auth.constants';
import type { SignupInput, SignupOutput } from './signup.module';

@Injectable()
export class SignupOrchestrator {
  constructor(
    private readonly users: UserService,
    private readonly jwt: JwtService,
  ) {}

  async run({
    email,
    firstName,
    lastName,
    password,
  }: SignupInput): Promise<SignupOutput> {
    if (await this.users.findByEmail(email)) {
      throw new ConflictException('Email is already registered.');
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = toUserResponse(
      await this.users.create({ email, firstName, lastName, passwordHash }),
    );
    return { user, token: this.jwt.sign({ sub: user.id, email: user.email }) };
  }
}
