import { describe, expect, it } from 'vitest';
import { sendUserMessage } from './MessageComposer.api';

describe('sendUserMessage', () => {
  it('returns a user message with the given content', async () => {
    const res = await sendUserMessage('2', 'hi there');

    expect(res.message.content).toBe('hi there');
    expect(res.message.sender).toBe('user');
    expect(res.message.conversationId).toBe('2');
  });
});
