import { Module } from '@nestjs/common';
import { StoreModule } from './store/store.module';

// Bundles cross-cutting providers. The store is global (see StoreModule).
@Module({
  imports: [StoreModule],
  exports: [StoreModule],
})
export class CommonModule {}
