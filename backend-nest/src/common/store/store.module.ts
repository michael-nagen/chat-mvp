import { Global, Module } from '@nestjs/common';
import { InMemoryStoreService } from './in-memory-store.service';

// Global so every feature repository can inject the store without re-importing.
@Global()
@Module({
  providers: [InMemoryStoreService],
  exports: [InMemoryStoreService],
})
export class StoreModule {}
