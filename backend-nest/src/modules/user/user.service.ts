import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../memory/entities';

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  // Caller hashes the password; the service only ever stores a hash.
  create({
    email,
    name,
    passwordHash,
  }: {
    email: string;
    name: string;
    passwordHash: string;
  }): Promise<User> {
    const user: User = { id: `u-${randomUUID()}`, email, name, passwordHash };
    return this.repo.create(user);
  }

  findById(id: string): Promise<User | undefined> {
    return this.repo.findById(id);
  }

  // Full entity (incl. password hash) for internal auth use — never sent on the wire.
  findByEmail(email: string): Promise<User | undefined> {
    return this.repo.findByEmail(email);
  }
}
