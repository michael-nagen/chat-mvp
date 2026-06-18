import { Module } from '@nestjs/common';
import {
  StorageDriver,
  repositoryStorage,
} from '../../common/storage/storage.config';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { MongoUserRepository } from './user.repository.mongo';
import { InMemoryUserRepository } from './user.repository.memory';
import { UserDoc, UserSchema } from './user.schema';

// ── Single change point: this entity's storage driver. ──────────────────────
export const USER_DRIVER: StorageDriver = 'mongo';

const storage = repositoryStorage({
  driver: USER_DRIVER,
  token: UserRepository,
  mongo: MongoUserRepository,
  memory: InMemoryUserRepository,
  feature: { name: UserDoc.name, schema: UserSchema },
});

@Module({
  imports: storage.imports,
  providers: [UserService, ...storage.providers],
  exports: [UserService],
})
export class UserModule {}
