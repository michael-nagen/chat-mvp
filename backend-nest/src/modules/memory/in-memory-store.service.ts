import { Injectable } from '@nestjs/common';
import {
  Conversation,
  KnowledgeChunk,
  KnowledgeDocument,
  Message,
  User,
} from '../../common/storage/entities';

// Process-local seed data shared by every feature module's repository.
// Mirrors the Express backend's shared/store/inMemoryStore.
@Injectable()
export class InMemoryStoreService {
  // passwordHash holds plaintext here for readability; InMemorySeedHasher hashes
  // it in place at boot so login's password check matches.
  readonly knownUsers: Record<string, User> = {
    u1: { id: 'u1', email: 'alice@example.com', firstName: 'Alice', lastName: 'Anderson', passwordHash: 'password', contactIds: ['u2'] },
    u2: { id: 'u2', email: 'bob@example.com', firstName: 'Bob', lastName: 'Brown', passwordHash: 'password', contactIds: ['u1'] },
  };

  readonly conversations: Conversation[] = [
    {
      id: 'c1',
      title: 'Alice & Bob',
      participantIds: ['u1', 'u2'],
      lastMessage: 'See you tomorrow!',
      updatedAt: '2026-06-04T08:30:00.000Z',
      type: 'dm',
      conversationKey: 'dm:u1:u2',
    },
    {
      id: 'c2',
      title: 'Project chat',
      participantIds: ['u1', 'u2'],
      lastMessage: 'Sounds good.',
      updatedAt: '2026-06-03T17:45:00.000Z',
      type: 'group',
      conversationKey: 'group:u1:u2',
    },
  ];

  readonly messages: Message[] = [
    {
      id: 'm1',
      conversationId: 'c1',
      senderId: 'u1',
      content: 'Hey Bob!',
      createdAt: '2026-06-04T08:00:00.000Z',
    },
    {
      id: 'm2',
      conversationId: 'c1',
      senderId: 'u2',
      content: 'Hey Alice, how are you?',
      createdAt: '2026-06-04T08:15:00.000Z',
    },
    {
      id: 'm3',
      conversationId: 'c1',
      senderId: 'u1',
      content: 'See you tomorrow!',
      createdAt: '2026-06-04T08:30:00.000Z',
    },
  ];

  // No seed data: knowledge documents are created entirely at runtime by users.
  readonly knowledgeDocuments: KnowledgeDocument[] = [];

  // No seed data: chunks are derived from uploaded documents at runtime.
  readonly knowledgeChunks: KnowledgeChunk[] = [];
}
