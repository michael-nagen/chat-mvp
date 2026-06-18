import { Module } from '@nestjs/common';
import {
  StorageDriver,
  repositoryStorage,
} from '../../common/storage/storage.config';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';
import { MongoMessagesRepository } from './messages.repository.mongo';
import { InMemoryMessagesRepository } from './messages.repository.memory';
import { MessageDoc, MessageSchema } from './messages.schema';

// ── Single change point: this entity's storage driver. ──────────────────────
export const MESSAGES_DRIVER: StorageDriver = 'mongo';

const storage = repositoryStorage({
  driver: MESSAGES_DRIVER,
  token: MessagesRepository,
  mongo: MongoMessagesRepository,
  memory: InMemoryMessagesRepository,
  feature: { name: MessageDoc.name, schema: MessageSchema },
});

@Module({
  imports: storage.imports,
  providers: [MessagesService, ...storage.providers],
  exports: [MessagesService],
})
export class MessagesModule {}
