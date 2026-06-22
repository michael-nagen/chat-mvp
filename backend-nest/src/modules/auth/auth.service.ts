import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  hashPassword({ password }: { password: string }): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  verifyPassword({
    password,
    passwordHash,
  }: {
    password: string;
    passwordHash: string;
  }): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  signToken({ id, email }: { id: string; email: string }): string {
    return this.jwt.sign({ sub: id, email });
  }
}
