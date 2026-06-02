import { describe, expect, it } from 'vitest';
import { getConversationMessages } from '../model/MessageList.api';

describe('getConversationMessages cursor pagination', () => {
  it('returns the newest page and a cursor, then the older page', async () => {
    const first = await getConversationMessages('1', undefined, 10);

    expect(first.messages).toHaveLength(10);
    expect(first.nextCursor).not.toBeNull();

    const older = await getConversationMessages('1', first.nextCursor ?? undefined, 10);
    const oldestOfFirst = first.messages[0].id;

    expect(older.messages).toHaveLength(10);
    expect(older.messages.some((message) => message.id === oldestOfFirst)).toBe(false);
    expect(older.nextCursor).not.toBe(first.nextCursor);
  });
});
