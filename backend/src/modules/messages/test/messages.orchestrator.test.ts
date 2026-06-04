import { describe, expect, it } from 'vitest';
import { messageOrchestrator } from '../messages.orchestrator';
import { conversationService } from '../../conversations/conversations.service';
import { ConversationNotFoundError } from '../../../shared/errors/AppError';

describe('messageOrchestrator.listMessages', () => {
  it('returns the conversation page for a participant', () => {
    const page = messageOrchestrator.listMessages('c1', 'u1', { limit: 20 });
    expect(page.messages.length).toBeGreaterThanOrEqual(3);
  });

  it('throws ConversationNotFoundError for a non-participant', () => {
    expect(() => messageOrchestrator.listMessages('c1', 'ghost', { limit: 20 })).toThrow(
      ConversationNotFoundError,
    );
  });

  it('throws ConversationNotFoundError for an unknown conversation', () => {
    expect(() => messageOrchestrator.listMessages('missing', 'u1', { limit: 20 })).toThrow(
      ConversationNotFoundError,
    );
  });
});

describe('messageOrchestrator.createMessage', () => {
  it('persists the message and updates the conversation preview', () => {
    const message = messageOrchestrator.createMessage('c1', 'u1', 'Fresh message');

    expect(message.conversationId).toBe('c1');
    expect(message.content).toBe('Fresh message');

    const stored = messageOrchestrator.listMessages('c1', 'u1', { limit: 20 });
    expect(stored.messages.some((m) => m.id === message.id)).toBe(true);
    expect(conversationService.getById('c1')?.lastMessage).toBe('Fresh message');
  });

  it('rejects a sender who is not a participant', () => {
    expect(() => messageOrchestrator.createMessage('c1', 'ghost', 'hi')).toThrow(
      ConversationNotFoundError,
    );
  });
});
