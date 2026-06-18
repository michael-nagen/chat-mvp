import { Module } from '@nestjs/common';
import {
  StorageDriver,
  repositoryStorage,
} from '../../common/storage/storage.config';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';
import { MongoMessagesRepository } from './storage/mongo-messages.repository';
import { InMemoryMessagesRepository } from './storage/in-memory-messages.repository';
import { MessageDoc, MessageSchema } from './storage/messages.schema';

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
