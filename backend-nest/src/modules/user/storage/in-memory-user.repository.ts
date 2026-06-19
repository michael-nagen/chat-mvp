import { Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../../memory/in-memory-store.service';
import { User } from '../../memory/entities';
import { UserUpdate } from '../user.types';
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

  findByIds(ids: string[]): Promise<User[]> {
    return Promise.resolve(
      ids
        .map((id) => this.store.knownUsers[id])
        .filter((user): user is User => user !== undefined),
    );
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

  update(id: string, patch: UserUpdate): Promise<User | undefined> {
    const existing = this.store.knownUsers[id];
    if (!existing) {
      return Promise.resolve(undefined);
    }
    const updated: User = { ...existing, ...patch };
    this.store.knownUsers[id] = updated;
    return Promise.resolve(updated);
  }
}
