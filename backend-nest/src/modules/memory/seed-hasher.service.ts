import { Injectable, OnModuleInit } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { InMemoryStoreService } from './in-memory-store.service';

// Hashes the seed users' plaintext passwords at boot via the auth service, so
// hashing stays in the auth layer and never in the storage entity itself.
@Injectable()
export class InMemorySeedHasher implements OnModuleInit {
  constructor(
    private readonly store: InMemoryStoreService,
    private readonly auth: AuthService,
  ) {}

  async onModuleInit(): Promise<void> {
    for (const user of Object.values(this.store.knownUsers)) {
      user.passwordHash = await this.auth.hashPassword({
        password: user.passwordHash,
      });
    }
  }
}
