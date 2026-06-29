import { Module } from '@nestjs/common';
import {
  StorageDriver,
  repositoryStorage,
} from '../../common/storage/storage.config';
import { ConversationsService } from './conversations.service';
import { ConversationsRepository } from './conversations.repository';
import { MongoConversationsRepository } from './storage/mongo-conversations.repository';
import { InMemoryConversationsRepository } from './storage/in-memory-conversations.repository';
import { ConversationDoc, ConversationSchema } from './storage/conversations.schema';

// ── Single change point: this entity's storage driver. ──────────────────────
export const CONVERSATIONS_DRIVER: StorageDriver = 'mongo';

const storage = repositoryStorage({
  driver: CONVERSATIONS_DRIVER,
  token: ConversationsRepository,
  mongo: MongoConversationsRepository,
  memory: InMemoryConversationsRepository,
  feature: { name: ConversationDoc.name, schema: ConversationSchema },
});

@Module({
  imports: storage.imports,
  providers: [ConversationsService, ...storage.providers],
  exports: [ConversationsService],
})
export class ConversationsModule {}
