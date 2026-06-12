import { describe, expect, it } from 'vitest';
import { messageRepository } from '../messages.repo';
import type { Message } from '../messages.types';

const makeMessage = (overrides: Partial<Message> = {}): Message => ({
  id: 'm-test',
  conversationId: 'c1',
  senderId: 'u1',
  content: 'hi',
  createdAt: '2026-06-04T09:00:00.000Z',
  ...overrides,
});

describe('messageRepository.findPage', () => {
  it('returns at most limit + 1 records, ordered oldest -> newest', () => {
    const result = messageRepository.findPage('c1', undefined, 2);
    expect(result).toHaveLength(3); // limit (2) + 1 lookahead
    expect(result.map((m) => m.id)).toEqual(['m1', 'm2', 'm3']);
  });

  it('starts just after the given cursor', () => {
    const result = messageRepository.findPage('c1', 'm1', 2);
    expect(result.map((m) => m.id)).toEqual(['m2', 'm3']);
  });

  it('returns fewer than limit + 1 when the conversation is exhausted', () => {
    const result = messageRepository.findPage('c1', undefined, 50);
    expect(result.length).toBeLessThan(51);
  });

  it('returns an empty array for a conversation with no messages', () => {
    expect(messageRepository.findPage('c-empty', undefined, 20)).toEqual([]);
  });
});

describe('messageRepository.insert', () => {
  it('persists and returns the message', () => {
    const message = makeMessage({ id: 'm-insert-1', conversationId: 'c-insert-target' });
    const returned = messageRepository.insert(message);
    expect(returned).toBe(message);
    expect(messageRepository.findPage('c-insert-target', undefined, 20)).toContainEqual(message);
  });
});
