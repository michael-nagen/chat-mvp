import { describe, expect, it } from 'vitest';
import { messageService } from '../messages.service';
import { conversationService } from '../../conversations/conversations.service';
import { ConversationNotFoundError } from '../../../shared/errors/AppError';

describe('messageService.getMessages', () => {
  it('returns the conversation messages oldest -> newest', () => {
    const messages = messageService.getMessages('c1', 'u1');
    expect(messages.length).toBeGreaterThanOrEqual(3);
    const times = messages.map((m) => new Date(m.createdAt).getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it('throws ConversationNotFoundError for a non-participant', () => {
    expect(() => messageService.getMessages('c1', 'ghost')).toThrow(ConversationNotFoundError);
  });

  it('throws ConversationNotFoundError for an unknown conversation', () => {
    expect(() => messageService.getMessages('missing', 'u1')).toThrow(ConversationNotFoundError);
  });
});

describe('messageService.createMessage', () => {
  it('persists the message and updates the conversation preview', () => {
    const message = messageService.createMessage('c1', 'u1', 'Fresh message');

    expect(message.conversationId).toBe('c1');
    expect(message.senderId).toBe('u1');
    expect(message.content).toBe('Fresh message');
    expect(message.id).toMatch(/^m-/);

    const stored = messageService.getMessages('c1', 'u1');
    expect(stored.some((m) => m.id === message.id)).toBe(true);
    expect(conversationService.getById('c1')?.lastMessage).toBe('Fresh message');
  });

  it('rejects a sender who is not a participant', () => {
    expect(() => messageService.createMessage('c1', 'ghost', 'hi')).toThrow(
      ConversationNotFoundError,
    );
  });
});
