import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../common/store/entities';
import { NotFoundException } from '../../common/errors/app.exception';
import { UserResponse } from './user.types';

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  findAll(): UserResponse[] {
    return this.repo.findAll().map((user) => this.toResponse(user));
  }

  create({ email, name, password }: CreateUserDto): UserResponse {
    const user: User = { id: `u-${randomUUID()}`, email, name, password };
    return this.toResponse(this.repo.create(user));
  }

  // Full entity (incl. password hash) for internal auth use — not an HTTP response.
  findByEmail(email: string): User | undefined {
    return this.repo.findByEmail(email);
  }

  returnUser(id: string): UserResponse {
    const user = this.repo.findById(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return this.toResponse(user);
  }

  private toResponse(user: User): UserResponse {
    return { id: user.id, email: user.email, name: user.name };
  }
}
