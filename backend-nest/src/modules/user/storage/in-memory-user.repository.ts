import { Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../../memory/in-memory-store.service';
import { User } from '../../memory/entities';
import { UserRepository } from '../user.repository';

// In-memory driver for users, backed by the shared seed store.
@Injectable()
export class InMemoryUserRepository extends UserRepository {
  constructor(private readonly store: InMemoryStoreService) {
    super();
  }

  findById(id: string): Promise<User | undefined> {
    return Promise.resolve(this.store.knownUsers[id]);
  }

  findByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(
      Object.values(this.store.knownUsers).find((user) => user.email === email),
    );
  }

  create(user: User): Promise<User> {
    this.store.knownUsers[user.id] = user;
    return Promise.resolve(user);
  }
}
