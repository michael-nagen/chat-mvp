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

describe('messageRepository.findByConversation', () => {
  it('returns only messages of the given conversation', () => {
    const result = messageRepository.findByConversation('c1');
    expect(result.length).toBeGreaterThanOrEqual(3);
    expect(result.every((m) => m.conversationId === 'c1')).toBe(true);
  });

  it('returns an empty array for a conversation with no messages', () => {
    expect(messageRepository.findByConversation('c-empty')).toEqual([]);
  });
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
    expect(messageRepository.findByConversation('c-insert-target')).toContainEqual(message);
  });
});
