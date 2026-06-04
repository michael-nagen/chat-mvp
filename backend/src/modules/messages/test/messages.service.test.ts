import { describe, expect, it } from 'vitest';
import { messageService } from '../messages.service';

describe('messageService.getMessages', () => {
  it('returns the conversation messages oldest -> newest', () => {
    const { messages } = messageService.getMessages('c1', { limit: 20 });
    expect(messages.length).toBeGreaterThanOrEqual(3);
    const times = messages.map((m) => new Date(m.createdAt).getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it('returns nextCursor null when the page fits within the limit', () => {
    const { nextCursor } = messageService.getMessages('c1', { limit: 20 });
    expect(nextCursor).toBeNull();
  });

  it('caps the page at limit and returns a real nextCursor when more exist', () => {
    const page = messageService.getMessages('c1', { limit: 2 });
    expect(page.messages).toHaveLength(2);
    expect(page.messages.map((m) => m.id)).toEqual(['m1', 'm2']);
    expect(page.nextCursor).toBe('m2');
  });

  it('returns the next page starting after the cursor', () => {
    const page = messageService.getMessages('c1', { cursor: 'm2', limit: 2 });
    expect(page.messages[0].id).toBe('m3');
  });
});

describe('messageService.createMessage', () => {
  it('persists the message', () => {
    const message = messageService.createMessage('c1', 'u1', 'Fresh message');

    expect(message.conversationId).toBe('c1');
    expect(message.senderId).toBe('u1');
    expect(message.content).toBe('Fresh message');
    expect(message.id).toMatch(/^m-/);

    const stored = messageService.getMessages('c1', { limit: 20 });
    expect(stored.messages.some((m) => m.id === message.id)).toBe(true);
  });
});
