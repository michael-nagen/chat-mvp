import { Conversation } from '../conversations.types';

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
