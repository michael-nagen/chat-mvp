import { beforeAll, describe, expect, it } from 'vitest';
import { sendUserMessage } from '../model/MessageComposer.api';
import { post, setTokenProvider } from '../../../shared/api/apiClient';

beforeAll(async () => {
  const { token } = await post<{ token: string }>(
    '/auth/login',
    { email: 'alice@example.com', password: 'password' },
    { auth: false },
  );
  setTokenProvider(() => token);
});

describe('sendUserMessage', () => {
  it('returns a message with the given content', async () => {
    const res = await sendUserMessage({ conversationId: 'c2', content: 'hi there' });

    expect(res.message.content).toBe('hi there');
    expect(typeof res.message.senderId).toBe('string');
    expect(res.message.conversationId).toBe('c2');
  });
});
