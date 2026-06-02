import type { Conversation } from '../entities/Conversation.types';
import type { Message } from '../entities/Message.types';
import type { User } from '../entities/User.types';


/** Seed accounts available for mock login. */
export const users: User[] = [
    { id: 'u1', name: 'Alice' },
    { id: 'u2', name: 'Bob' },
]

/** Seed conversations used by the mock API. */
export const conversations: Conversation[] = [
    {
        id: '1',
        title: 'Chat with Assistant',
        lastMessage: 'Hello! How can I assist you today?',
        updatedAt: new Date().toISOString(),
        participantIds: ['u1'],
    },
    {
        id: '2',
        title: 'Project Discussion',
        lastMessage: 'Let\'s discuss the project requirements.',
        updatedAt: new Date().toISOString(),
        participantIds: ['u1', 'u2'],
    },
]
// A long thread for conversation '1' (oldest -> newest) so pagination is meaningful.
const baseTime = new Date('2026-05-30T09:00:00.000Z').getTime();
const longThread: Message[] = Array.from({ length: 40 }, (_, i) => {
    const isUser = i % 2 === 0;
    return {
        id: `m${i + 1}`,
        conversationId: '1',
        content: isUser ? `User message #${i + 1}` : `Assistant reply #${i + 1}`,
        sender: isUser ? 'user' : 'assistant',
        timestamp: new Date(baseTime + i * 60_000).toISOString(),
    };
});

/** All seed messages across every mock conversation. */
export const messages: Message[] = [
    ...longThread,
    {
        id: 'c2-1',
        conversationId: '2',
        content: 'Let\'s discuss the project requirements.',
        sender: 'assistant',
        timestamp: new Date('2026-05-30T08:00:00.000Z').toISOString(),
    },
]
