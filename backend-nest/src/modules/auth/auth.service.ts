import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { UserResponse } from '../user/user.types';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import {
  ConflictException,
  UnauthorizedException,
} from '../../common/errors/app.exception';
import { AuthResult } from './auth.types';
import { SALT_ROUNDS } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly jwt: JwtService,
  ) {}

  async signup({ email, name, password }: SignupDto): Promise<AuthResult> {
    if (this.users.findByEmail(email)) {
      throw new ConflictException('Email is already registered.');
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = this.users.create({ email, name, password: passwordHash });
    return { user, token: this.sign(user) };
  }

  async login({ email, password }: LoginDto): Promise<AuthResult> {
    const found = this.users.findByEmail(email);
    if (!found || !(await bcrypt.compare(password, found.password))) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    const user: UserResponse = {
      id: found.id,
      email: found.email,
      name: found.name,
    };
    return { user, token: this.sign(user) };
  }

  private sign(user: UserResponse): string {
    return this.jwt.sign({ sub: user.id, email: user.email });
  }
}
