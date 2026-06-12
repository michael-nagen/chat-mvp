import { Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../../common/store/in-memory-store.service';

// Data access for users. Methods will be added when the module is implemented.
@Injectable()
export class AuthRepository {
  constructor(private readonly store: InMemoryStoreService) {}
}
