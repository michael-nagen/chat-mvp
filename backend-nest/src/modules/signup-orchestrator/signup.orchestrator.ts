import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { toUserResponse } from '../user/user.mapper';
import type { SignupInput, SignupOutput } from './signup.module';

@Injectable()
export class SignupOrchestrator {
  constructor(
    private readonly users: UserService,
    private readonly auth: AuthService,
  ) {}

  async execute({
    email,
    firstName,
    lastName,
    password,
  }: SignupInput): Promise<SignupOutput> {
    const passwordHash = await this.auth.hashPassword({ password });
    const user = toUserResponse(
      await this.users.create({ email, firstName, lastName, passwordHash }),
    );
    return {
      user,
      token: this.auth.signToken({ id: user.id, email: user.email }),
    };
  }
}
