import { describe, it, expect } from 'vitest';
import { getMessages, sendMessage } from './apiClient';

describe('sendMessage', () => {
  it('returns a user message with the given content', async () => {
    const res = await sendMessage('1', 'hi there');
    expect(res.message.content).toBe('hi there');
    expect(res.message.sender).toBe('user');
    expect(res.message.conversationId).toBe('1');
  });
});

describe('getMessages cursor pagination', () => {
  it('returns the newest page and a cursor, then the older page', async () => {
    const first = await getMessages('1', undefined, 10);
    expect(first.messages).toHaveLength(10);
    expect(first.nextCursor).not.toBeNull();

    const older = await getMessages('1', first.nextCursor ?? undefined, 10);
    expect(older.messages).toHaveLength(10);
    // the older page ends right where the first page begins (no overlap, no gap)
    const oldestOfFirst = first.messages[0].id;
    expect(older.messages.some((m) => m.id === oldestOfFirst)).toBe(false);
    expect(older.nextCursor).not.toBe(first.nextCursor);
  });
});
