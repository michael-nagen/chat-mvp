import { User } from '../../modules/auth/auth.types';
import { Conversation } from '../../modules/conversations/conversations.types';
import { Message } from '../../modules/messages/messages.types';

export const KNOWN_USERS: Record<string, User> = {
  u1: { id: 'u1', name: 'Alice' },
  u2: { id: 'u2', name: 'Bob' },
};

export const conversations: Conversation[] = [
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

export const messages: Message[] = [
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
