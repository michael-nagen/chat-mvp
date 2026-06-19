import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Conversation, Message, User } from './entities';

// Process-local seed data shared by every feature module's repository.
// Mirrors the Express backend's shared/store/inMemoryStore.
@Injectable()
export class InMemoryStoreService implements OnModuleInit {
  // Plaintext here for readability; hashed in place at boot so login's
  // bcrypt.compare matches (see onModuleInit).
  readonly knownUsers: Record<string, User> = {
    u1: { id: 'u1', email: 'alice@example.com', firstName: 'Alice', lastName: 'Anderson', passwordHash: 'password' },
    u2: { id: 'u2', email: 'bob@example.com', firstName: 'Bob', lastName: 'Brown', passwordHash: 'password' },
  };

  async onModuleInit(): Promise<void> {
    for (const user of Object.values(this.knownUsers)) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
    }
  }

  readonly conversations: Conversation[] = [
    {
      id: 'c1',
      title: 'Alice & Bob',
      participantIds: ['u1', 'u2'],
      lastMessage: 'See you tomorrow!',
      updatedAt: '2026-06-04T08:30:00.000Z',
    },
    {
      id: 'c2',
      title: 'Project chat',
      participantIds: ['u1', 'u2'],
      lastMessage: 'Sounds good.',
      updatedAt: '2026-06-03T17:45:00.000Z',
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
}
