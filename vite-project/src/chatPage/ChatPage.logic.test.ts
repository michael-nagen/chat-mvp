import { describe, it, expect, vi } from 'vitest';
import { buildChatPageViewProps } from './ChatPage.logic';

describe('buildChatPageViewProps', () => {
  it('maps composer args into composerProps', () => {
    const onComposerSend = vi.fn();
    const result = buildChatPageViewProps({
      conversations: [],
      isLoadingConversations: false,
      conversationsError: null,
      selectedConversationId: null,
      onSelectConversation: vi.fn(),
      messages: [],
      isLoadingMessages: false,
      messagesError: null,
      composerValue: 'hello',
      isSending: true,
      onComposerChange: vi.fn(),
      onComposerSend,
      currentUserName: 'Alice',
      sendError: null,
      onDismissSendError: vi.fn(),
    });

    expect(result.composerProps.value).toBe('hello');
    expect(result.composerProps.isSending).toBe(true);
    expect(result.composerProps.onSend).toBe(onComposerSend);
  });
});
