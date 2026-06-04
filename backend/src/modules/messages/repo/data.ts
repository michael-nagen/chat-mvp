import { Message } from '../messages.types';

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
