import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { InMemoryStoreService } from './in-memory-store.service';
import { InMemorySeedHasher } from './seed-hasher.service';

// Global so every feature repository can inject the store without re-importing.
@Global()
@Module({
  imports: [AuthModule],
  providers: [InMemoryStoreService, InMemorySeedHasher],
  exports: [InMemoryStoreService],
})
export class StoreModule {}
