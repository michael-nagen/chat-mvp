import { Module } from '@nestjs/common';
import { StoreModule } from '../modules/memory/store.module';

// Bundles cross-cutting providers. The store is global (see StoreModule).
@Module({
  imports: [StoreModule],
  exports: [StoreModule],
})
export class CommonModule {}
