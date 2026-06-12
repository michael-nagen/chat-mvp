import { Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../../common/store/in-memory-store.service';
import { User } from '../../common/store/entities';

@Injectable()
export class UserRepository {
  constructor(private readonly store: InMemoryStoreService) {}

  findAll(): User[] {
    return Object.values(this.store.knownUsers);
  }

  findById(id: string): User | undefined {
    return this.store.knownUsers[id];
  }

  findByEmail(email: string): User | undefined {
    return Object.values(this.store.knownUsers).find((user) => user.email === email);
  }

  create(user: User): User {
    this.store.knownUsers[user.id] = user;
    return user;
  }
}
